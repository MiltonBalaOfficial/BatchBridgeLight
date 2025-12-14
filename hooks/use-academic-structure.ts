import { useState, useEffect, useMemo, useCallback } from 'react';
import { AcademicNode } from '@/lib/types';

interface AcademicTreeNode extends AcademicNode {
  children: AcademicTreeNode[];
}

const buildTree = (nodes: AcademicNode[]): AcademicTreeNode[] => {
  const nodeMap = new Map<string, AcademicTreeNode>();
  const tree: AcademicTreeNode[] = [];

  nodes
    .filter((node) => !node.deletedAt)
    .forEach((node) => {
      const newNode: AcademicTreeNode = {
        ...node,
        children: [],
        collapsed: true, // Default to collapsed for the tree structure
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

export const useAcademicStructure = () => {
  const [academicNodes, setAcademicNodes] = useState<AcademicNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/database/academic-structure.json')
      .then((res) => res.json())
      .then((data: AcademicNode[]) => {
        setAcademicNodes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch academic structure:', error);
        setIsLoading(false);
      });
  }, []);

  const nodeMap = useMemo(() => {
    const map = new Map<string, AcademicTreeNode>();
    const tree = buildTree(academicNodes); // Build tree here to get hierarchical nodes
    const buildMapRecursive = (nodes: AcademicTreeNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node);
        if (node.children) {
          buildMapRecursive(node.children);
        }
      });
    };
    buildMapRecursive(tree); // Use the built tree to populate the map
    return map;
  }, [academicNodes]);

  const getAcademicPathNamesByIds = useCallback(
    (degreeId?: string, courseId?: string, subjectId?: string) => {
      let degreeName: string | undefined;
      let courseName: string | undefined;
      let subjectName: string | undefined;

      if (degreeId) {
        degreeName = nodeMap.get(degreeId)?.name;
      }
      if (courseId) {
        courseName = nodeMap.get(courseId)?.name;
      }
      if (subjectId) {
        subjectName = nodeMap.get(subjectId)?.name;
      }

      return { degree: degreeName, course: courseName, subject: subjectName };
    },
    [nodeMap]
  );

  return { isLoading, nodeMap, academicNodes, getAcademicPathNamesByIds };
};
