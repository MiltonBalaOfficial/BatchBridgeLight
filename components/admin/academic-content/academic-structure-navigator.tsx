'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  BookText,
  Library,
  GraduationCap,
} from 'lucide-react';
import { AcademicNode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useAcademicStructure } from '@/hooks/use-academic-structure'; // New import

interface AcademicTreeNode extends AcademicNode {
  children: AcademicTreeNode[];
}

const LOCAL_STORAGE_KEY = 'academic_structure_collapsed_state';

const buildTree = (
  nodes: AcademicNode[],
  collapsedState: { [key: string]: boolean } = {}
): AcademicTreeNode[] => {
  const nodeMap = new Map<string, AcademicTreeNode>();
  const tree: AcademicTreeNode[] = [];

  nodes
    .filter((node) => !node.deletedAt)
    .forEach((node) => {
      const newNode: AcademicTreeNode = {
        ...node,
        children: [],
        // Initialize collapsed state: true if explicitly collapsed in stored state, else false if explicitly open, else true by default
        collapsed:
          collapsedState[node.id] !== undefined
            ? collapsedState[node.id]
            : true,
      };
      nodeMap.set(newNode.id, newNode);
    });

  nodes
    .filter((node) => !node.deletedAt)
    .forEach((node) => {
      if (node.parentId === null) {
        tree.push(nodeMap.get(node.id)!);
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children!.push(nodeMap.get(node.id)!);
        }
      }
    });

  const sortNodes = (nodesArray: AcademicTreeNode[]) => {
    nodesArray.sort((a, b) => a.orderIndex - b.orderIndex);
    nodesArray.forEach((node) => {
      if (node.children) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(tree);
  return tree;
};

interface AcademicNavigatorNodeProps {
  node: AcademicTreeNode;
  level: number;
  onToggleCollapse: (id: string) => void;
  activeNodeId: string | null;
  onSetActiveNode: (nodeId: string | null) => void;
  ancestorIds: string[];
}

const getNodeIcon = (type: AcademicNode['type']) => {
  switch (type) {
    case 'degree':
      return <GraduationCap className='mr-2 h-4 w-4' />;
    case 'course':
      return <Library className='mr-2 h-4 w-4' />;
    case 'subject':
      return <BookText className='mr-2 h-4 w-4' />;
    default:
      return null;
  }
};

const AcademicNavigatorNode: React.FC<AcademicNavigatorNodeProps> = ({
  node,
  level,
  onToggleCollapse,
  activeNodeId,
  onSetActiveNode,
  ancestorIds,
}) => {
  const isHighlighted =
    activeNodeId === node.id || ancestorIds.includes(node.id);

  return (
    <div
      className={cn(
        'py-1 select-none',
        level > 0 ? `ml-${2 + level * 2}` : 'ml-2'
      )}
    >
      <div
        className={cn(
          'flex cursor-pointer items-center gap-1 rounded px-2 py-1',
          'hover:bg-muted/50',
          isHighlighted && 'bg-muted'
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSetActiveNode(node.id);
          if (node.children && node.children.length > 0) {
            onToggleCollapse(node.id);
          }
        }}
      >
        {node.children && node.children.length > 0 ? (
          <Button
            variant='ghost'
            size='icon'
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(node.id);
            }}
            className='h-6 w-6'
          >
            {node.collapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </Button>
        ) : (
          <span className='inline-block w-6' />
        )}
        {getNodeIcon(node.type)}
        <span className='text-sm font-medium'>{node.name}</span>
      </div>
      {!node.collapsed && node.children && node.children.length > 0 && (
        <div className='mt-1'>
          {node.children.map((child: AcademicTreeNode) => (
            <AcademicNavigatorNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggleCollapse={onToggleCollapse}
              activeNodeId={activeNodeId}
              onSetActiveNode={onSetActiveNode}
              ancestorIds={ancestorIds}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AcademicStructureNavigatorProps {
  onNodeSelection?: (
    node: AcademicNode,
    degreeId: string | undefined,
    courseId: string | undefined,
    subjectId: string | undefined,
    degreeName: string | undefined,
    courseName: string | undefined,
    subjectName: string | undefined
  ) => void;
}

export const AcademicStructureNavigator: React.FC<
  AcademicStructureNavigatorProps
> = ({ onNodeSelection }) => {
  const {
    isLoading: isHookLoading,
    nodeMap,
    academicNodes,
  } = useAcademicStructure();
  const [treeData, setTreeData] = useState<AcademicTreeNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Load initial tree data and collapsed state
  useEffect(() => {
    if (!isHookLoading && academicNodes.length > 0) {
      const storedCollapsedState =
        typeof window !== 'undefined'
          ? localStorage.getItem(LOCAL_STORAGE_KEY)
          : null;
      const initialCollapsedState = storedCollapsedState
        ? JSON.parse(storedCollapsedState)
        : {};
      setTreeData(buildTree(academicNodes, initialCollapsedState));
    }
  }, [isHookLoading, academicNodes]);

  const handleSetActiveNode = (nodeId: string | null) => {
    setActiveNodeId(nodeId);
    if (onNodeSelection && nodeId) {
      const node = nodeMap.get(nodeId);
      if (node && node.type === 'subject') {
        let currentDegreeId: string | undefined = undefined;
        let currentCourseId: string | undefined = undefined;
        let currentSubjectId: string | undefined = undefined;
        let currentDegreeName: string | undefined = undefined;
        let currentCourseName: string | undefined = undefined;
        let currentSubjectName: string | undefined = undefined;

        currentSubjectId = node.id;
        currentSubjectName = node.name;
        const courseNode = nodeMap.get(node.parentId || '');
        if (courseNode && courseNode.type === 'course') {
          currentCourseId = courseNode.id;
          currentCourseName = courseNode.name;
          const degreeNode = nodeMap.get(courseNode.parentId || '');
          if (degreeNode && degreeNode.type === 'degree') {
            currentDegreeId = degreeNode.id;
            currentDegreeName = degreeNode.name;
          }
        }

        onNodeSelection(
          node,
          currentDegreeId,
          currentCourseId,
          currentSubjectId,
          currentDegreeName,
          currentCourseName,
          currentSubjectName
        );
      }
    }
  };

  const getAncestorIds = useCallback(
    (nodeId: string | null): string[] => {
      if (nodeId === null) return [];
      const node = nodeMap.get(nodeId);
      if (!node || !node.parentId) return [];
      const parents = getAncestorIds(node.parentId);
      return [node.parentId, ...parents];
    },
    [nodeMap]
  );

  const activeNodeAncestors = useMemo(
    () => (activeNodeId ? getAncestorIds(activeNodeId) : []),
    [activeNodeId, getAncestorIds]
  );

  const handleToggleCollapse = (id: string) => {
    setTreeData((prevTreeData) => {
      const updatedTree = prevTreeData.map((node) => {
        const toggleSingleNode = (
          currentNode: AcademicTreeNode
        ): AcademicTreeNode => {
          if (currentNode.id === id) {
            return { ...currentNode, collapsed: !currentNode.collapsed };
          }
          if (currentNode.children) {
            return {
              ...currentNode,
              children: currentNode.children.map(toggleSingleNode),
            };
          }
          return currentNode;
        };
        return toggleSingleNode(node);
      });

      const currentFullCollapsedState: { [key: string]: boolean } = {};
      const collectCollapsedState = (nodes: AcademicTreeNode[]) => {
        nodes.forEach((node) => {
          if (node.children && node.children.length > 0) {
            // Only track collapsible nodes
            currentFullCollapsedState[node.id] = node.collapsed;
          }
          if (node.children) {
            collectCollapsedState(node.children);
          }
        });
      };
      collectCollapsedState(updatedTree);
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(currentFullCollapsedState)
        );
      }

      return updatedTree;
    });
  };

  if (isHookLoading) {
    return (
      <div className='py-10 text-center text-sm text-muted-foreground'>
        Loading Structure...
      </div>
    );
  }

  return (
    <div className='space-y-1' onClick={() => handleSetActiveNode(null)}>
      {treeData.length === 0 && (
        <p className='text-muted-foreground'>No academic structure defined.</p>
      )}
      {treeData.map((node) => (
        <AcademicNavigatorNode
          key={node.id}
          node={node}
          level={0}
          onToggleCollapse={handleToggleCollapse}
          activeNodeId={activeNodeId}
          onSetActiveNode={handleSetActiveNode}
          ancestorIds={activeNodeAncestors}
        />
      ))}
    </div>
  );
};
