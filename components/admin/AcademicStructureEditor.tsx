'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Minus,
  Pencil,
  Save,
  ChevronDown,
  ChevronRight,
  Copy,
  Scissors,
  ClipboardPaste,
} from 'lucide-react';
import { AcademicNode, AcademicStructure } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import cloneDeep from 'lodash.clonedeep';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface AcademicTreeNode extends AcademicNode {
  children: AcademicTreeNode[];
}

// Utility function to build a hierarchical tree from a flat list
const buildTree = (nodes: AcademicNode[]): AcademicTreeNode[] => {
  const nodeMap = new Map<string, AcademicTreeNode>();
  const tree: AcademicTreeNode[] = [];

  // Filter out deleted nodes and initialize nodes with children array and populate map
  nodes
    .filter((node) => !node.deletedAt)
    .forEach((node) => {
      const newNode: AcademicTreeNode = { ...node, children: [] };
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
        } else {
          // Handle orphaned nodes: push to root as a fallback, and log an error
          console.warn(
            `Orphaned node found: ${node.name} (ID: ${node.id}) with parentId: ${node.parentId}. Pushing to root.`
          );
          tree.push(nodeMap.get(node.id)!);
        }
      }
    });

  // Sort nodes and their children by orderIndex
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

// Utility function to flatten a hierarchical tree back into a flat list
const flattenTree = (treeNodes: AcademicTreeNode[]): AcademicNode[] => {
  const flatNodes: AcademicNode[] = [];
  const traverse = (
    nodes: AcademicTreeNode[],
    parentId: string | null = null
  ) => {
    nodes.forEach((node, index) => {
      // Create a copy without the children property for the flat list
      const { children, ...rest } = node;
      flatNodes.push({
        ...rest,
        parentId: parentId, // Ensure parentId is correctly set during flattening
        orderIndex: index, // Re-evaluate orderIndex based on current tree order
      } as AcademicNode);
      if (children && children.length > 0) {
        traverse(children, node.id);
      }
    });
  };
  traverse(treeNodes);
  return flatNodes.sort(() => {
    // A stable sort ensures consistent ordering for nodes that might have been re-ordered
    // More robust sorting might be needed for complex scenarios, but this maintains tree structure order.
    return 0;
  });
};

interface AcademicNodeItemProps {
  node: AcademicTreeNode;
  level: number;
  onAdd: (
    parentId: string | null,
    type: AcademicNode['type'],
    initialName: string
  ) => void;
  onUpdate: (id: string, newValues: Partial<AcademicNode>) => void;
  onDelete: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  nodeTypes: { value: AcademicNode['type']; label: string }[];
  onCut: (node: AcademicTreeNode) => void;
  onPaste: (parentId: string | null, siblingId?: string) => void;
  nodeToCut: AcademicTreeNode | null;
  onDuplicate: (node: AcademicTreeNode) => void;
  activeNodeId: string | null;
  onSetActiveNode: (nodeId: string | null) => void;
  ancestorIds: string[];
}

const AcademicNodeItem: React.FC<AcademicNodeItemProps> = ({
  node,
  level,
  onAdd,
  onUpdate,
  onDelete,
  onToggleCollapse,
  nodeTypes,
  onCut: onCutNode,
  onPaste,
  nodeToCut,
  onDuplicate,
  activeNodeId,
  onSetActiveNode,
  ancestorIds,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(node.name);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    setIsHighlighted(activeNodeId === node.id || ancestorIds.includes(node.id));
  }, [activeNodeId, node.id, ancestorIds]);

  const childType: AcademicNode['type'] | undefined = useMemo(() => {
    if (node.type === 'degree') return 'course';
    if (node.type === 'course') return 'subject';
    return undefined;
  }, [node.type]);

  const handleUpdate = () => {
    onUpdate(node.id, {
      name: editedName,
      academicSystem: undefined,
    });
    setIsEditing(false);
  };

  const handleAddChild = () => {
    if (childType) {
      onAdd(
        node.id,
        childType,
        `New ${childType.charAt(0).toUpperCase() + childType.slice(1)}`
      );
    }
  };

  return (
    <div
      className={`py-1 ${level > 0 ? 'ml-4 border-l-2 border-gray-200' : ''} ${nodeToCut?.id === node.id ? 'bg-yellow-100 dark:bg-yellow-900' : ''} ${isHighlighted ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSetActiveNode(node.id);
      }}
    >
      <div className='flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700'>
        {node.children && node.children.length > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onToggleCollapse(node.id)}
            className='p-1'
          >
            {node.collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        )}
        {!(node.children && node.children.length > 0) && (
          <span className='inline-block' style={{ width: 24 }} /> // Placeholder for alignment
        )}
        <div className='flex flex-grow items-center'>
          {isEditing ? (
            <>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className='w-48'
              />
              <Badge variant='outline' className='ml-2'>
                {node.type}
              </Badge>
              <Button size='sm' onClick={handleUpdate} className='ml-2'>
                Save
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <span className='font-medium'>{node.name}</span>
              <Badge variant='outline' className='ml-2'>
                {node.type}
              </Badge>
              {node.deletedAt && (
                <Badge variant='destructive' className='ml-2'>
                  DELETED
                </Badge>
              )}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditing(true)}
                className='ml-auto'
              >
                <Pencil size={16} />
              </Button>
            </>
          )}
        </div>
        {childType && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleAddChild}
            title={`Add ${childType}`}
          >
            <Plus size={16} />
          </Button>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onCutNode(node)}
          title='Cut'
        >
          <Scissors size={16} />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onDuplicate(node)}
          title='Duplicate'
        >
          <Copy size={16} />
        </Button>
        {nodeToCut && (
          <>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onPaste(node.id)}
              title='Paste as child'
            >
              <ClipboardPaste size={16} />
            </Button>
            {level > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onPaste(node.parentId, node.id)}
                title='Paste as sibling'
              >
                <ClipboardPaste size={16} className='text-blue-500' />
              </Button>
            )}
          </>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onDelete(node.id)}
          title='Delete'
        >
          <Minus size={16} />
        </Button>
      </div>
      {!node.collapsed && node.children && node.children.length > 0 && (
        <div className='ml-6'>
          {node.children.map((child: AcademicTreeNode) => (
            <AcademicNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onAdd={onAdd}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleCollapse={onToggleCollapse}
              nodeTypes={nodeTypes}
              onCut={onCutNode}
              onPaste={onPaste}
              nodeToCut={nodeToCut}
              onDuplicate={onDuplicate}
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

interface AcademicStructureEditorProps {
  onNodeClick?: (node: AcademicNode) => void;
}

export const AcademicStructureEditor: React.FC<
  AcademicStructureEditorProps
> = ({ onNodeClick }) => {
  const [, setFlatAcademicStructure] = useState<AcademicStructure>([]);
  const [treeData, setTreeData] = useState<AcademicTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<string | null>(null);
  const [nodeToCut, setNodeToCut] = useState<AcademicTreeNode | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSetActiveNode = (nodeId: string | null) => {
    setActiveNodeId(nodeId);
    if (onNodeClick && nodeId) {
      const node = nodeMap.get(nodeId);
      if (node) {
        onNodeClick(node);
      }
    }
  };

  const nodeMap = useMemo(() => {
    const map = new Map<string, AcademicTreeNode>();
    const buildMap = (nodes: AcademicTreeNode[]) => {
      nodes.forEach((node) => {
        map.set(node.id, node);
        if (node.children) {
          buildMap(node.children);
        }
      });
    };
    buildMap(treeData);
    return map;
  }, [treeData]);

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

  const nodeTypes: { value: AcademicNode['type']; label: string }[] = useMemo(
    () => [
      { value: 'degree', label: 'Degree' },
      { value: 'course', label: 'Course' },
      { value: 'subject', label: 'Subject' },
    ],
    []
  );

  useEffect(() => {
    // Fetch the academic structure JSON
    fetch('/api/academic-structure')
      .then((res) => res.json())
      .then((data: AcademicStructure) => {
        setFlatAcademicStructure(data);
        setTreeData(buildTree(data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch academic structure:', error);
        setIsLoading(false);
      });
  }, []);

  const updateNodeOrderIndexes = (nodes: AcademicTreeNode[]) => {
    nodes.forEach((node, index) => {
      node.orderIndex = index;
      if (node.children) {
        updateNodeOrderIndexes(node.children);
      }
    });
  };

  const handleAddNode = (
    parentId: string | null,
    type: AcademicNode['type'],
    initialName: string
  ) => {
    const newNode: AcademicTreeNode = {
      id: uuidv4(),
      parentId,
      type,
      name: initialName,
      academicSystem: undefined,
      course: null,
      scopeId: uuidv4(),
      orderIndex: 0, // Will be set correctly when adding to parent's children
      collapsed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      synced: false,
      children: [],
    };

    setTreeData((prevTreeData) => {
      if (parentId === null) {
        // Add to root level
        const updatedTree = [...prevTreeData, newNode];
        updateNodeOrderIndexes(updatedTree); // Update orderIndexes
        return updatedTree;
      } else {
        // Add to a specific parent
        const updatedTree = prevTreeData.map((node) => {
          const findParentAndAddChild = (
            currentNode: AcademicTreeNode
          ): AcademicTreeNode => {
            if (currentNode.id === parentId) {
              const newChildren = [...(currentNode.children || []), newNode];
              updateNodeOrderIndexes(newChildren); // Update children's orderIndexes
              return { ...currentNode, children: newChildren };
            }
            if (currentNode.children) {
              return {
                ...currentNode,
                children: currentNode.children.map(findParentAndAddChild),
              };
            }
            return currentNode;
          };
          return findParentAndAddChild(node);
        });
        return updatedTree;
      }
    });
  };

  const handleUpdateNode = (id: string, newValues: Partial<AcademicNode>) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((node) => {
        const updateSingleNode = (
          currentNode: AcademicTreeNode
        ): AcademicTreeNode => {
          if (currentNode.id === id) {
            return {
              ...currentNode,
              ...newValues,
              updatedAt: new Date().toISOString(),
            };
          }
          if (currentNode.children) {
            return {
              ...currentNode,
              children: currentNode.children.map(updateSingleNode),
            };
          }
          return currentNode;
        };
        return updateSingleNode(node);
      });
    });
  };

  const handleDeleteNode = (id: string) => {
    setNodeToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (nodeToDelete === null) return;

    setTreeData((prevTreeData) => {
      const deleteRecursive = (
        nodes: AcademicTreeNode[]
      ): AcademicTreeNode[] => {
        const updatedNodes = nodes.flatMap((node) => {
          if (node.id === nodeToDelete) {
            if (node.deletedAt) {
              // Already soft-deleted, now permanently delete
              return [];
            }
            if (node.synced) {
              // Synced and not yet deleted, so soft-delete
              const deletedNode = {
                ...node,
                deletedAt: new Date().toISOString(),
              };
              return [deletedNode];
            }
            // Not synced, so just remove permanently
            return [];
          }
          if (node.children) {
            return [{ ...node, children: deleteRecursive(node.children) }];
          }
          return [node];
        });
        updateNodeOrderIndexes(updatedNodes); // Re-index siblings after deletion
        return updatedNodes;
      };

      const newTree = deleteRecursive(prevTreeData);
      updateNodeOrderIndexes(newTree); // Re-index top-level nodes
      return newTree;
    });

    setShowDeleteConfirm(false);
    setNodeToDelete(null);
  };

  const handleToggleCollapse = (id: string) => {
    setTreeData((prevTreeData) => {
      return prevTreeData.map((node) => {
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
    });
  };

  const handleCutNode = (node: AcademicTreeNode) => {
    if (nodeToCut?.id === node.id) {
      setNodeToCut(null); // Cancel cut
      setActiveNodeId(null);
    } else {
      setNodeToCut(node);
      setActiveNodeId(node.id);
    }
  };

  const handlePaste = (newParentId: string | null, siblingId?: string) => {
    if (!nodeToCut) return;

    const typeHierarchy: { [key: string]: AcademicNode['type'] | null } = {
      degree: 'course',
      course: 'subject',
      subject: null,
    };

    let targetRootNodeType: AcademicNode['type'] | null = null;
    if (siblingId) {
      const siblingNode = nodeMap.get(siblingId);
      if (siblingNode) {
        targetRootNodeType = siblingNode.type;
      }
    } else if (newParentId) {
      const parentNode = nodeMap.get(newParentId);
      if (parentNode) {
        targetRootNodeType = typeHierarchy[parentNode.type];
        if (!targetRootNodeType && parentNode.type === 'subject') {
          targetRootNodeType = 'subject';
        }
      }
    } else {
      targetRootNodeType = 'degree';
    }

    if (
      targetRootNodeType === 'subject' &&
      nodeToCut.children &&
      nodeToCut.children.length > 0
    ) {
      alert(
        "This paste operation is prohibited because it would result in a 'subject' node having children, which violates the hierarchy."
      );
      return;
    }

    const isDescendant = (
      potentialParentId: string | null,
      nodeToMoveId: string
    ): boolean => {
      if (potentialParentId === null) return false;
      if (potentialParentId === nodeToMoveId) return true;
      const parentNode = nodeMap.get(potentialParentId);
      if (!parentNode) return false;
      return isDescendant(parentNode.parentId, nodeToMoveId);
    };

    if (newParentId !== null && isDescendant(newParentId, nodeToCut.id)) {
      alert('Cannot paste a node into itself or its own descendant.');
      return;
    }

    // This function will convert a node and its children to fit within a given targetType,
    // following the typeHierarchy. It preserves IDs and other metadata.
    const recursivelyAdjustNodeTypes = (
      node: AcademicTreeNode,
      expectedType: AcademicNode['type'] | null
    ): AcademicTreeNode => {
      const updatedNode = cloneDeep(node);
      updatedNode.academicSystem = undefined;

      if (expectedType === null) {
        // Force to 'subject' and remove children if they don't fit the hierarchy.
        updatedNode.type = 'subject';
        updatedNode.children = [];
      } else {
        updatedNode.type = expectedType;
      }

      updatedNode.updatedAt = new Date().toISOString();

      if (updatedNode.children && updatedNode.children.length > 0) {
        const nextExpectedChildType = typeHierarchy[updatedNode.type];
        updatedNode.children = updatedNode.children.map((child) =>
          recursivelyAdjustNodeTypes(child, nextExpectedChildType)
        );
      } else {
        updatedNode.children = [];
      }
      return updatedNode;
    };

    setTreeData((prevTreeData) => {
      // 1. Remove the node from its current position
      const removeNode = (nodes: AcademicTreeNode[]): AcademicTreeNode[] => {
        return nodes
          .filter((node) => node.id !== nodeToCut.id)
          .map((node) => {
            if (node.children) {
              return { ...node, children: removeNode(node.children) };
            }
            return node;
          });
      };
      let newTree = removeNode(prevTreeData);

      let nodeToPaste = cloneDeep(nodeToCut);

      // Adjust types only if necessary
      if (targetRootNodeType && nodeToPaste.type !== targetRootNodeType) {
        nodeToPaste = recursivelyAdjustNodeTypes(
          nodeToPaste,
          targetRootNodeType
        );
      } else {
        // If the root type doesn't change, still mark as updated
        nodeToPaste.updatedAt = new Date().toISOString();
      }

      // Set the new parent ID for the moved node
      const finalNodeToPaste = {
        ...nodeToPaste,
        parentId: newParentId,
        academicSystem: undefined,
      };

      // 3. Add the node to the new parent
      if (newParentId === null) {
        // Add to root
        newTree = [...newTree, finalNodeToPaste];
      } else {
        const addNodeRecursively = (
          nodes: AcademicTreeNode[]
        ): AcademicTreeNode[] => {
          return nodes.map((node) => {
            if (node.id === newParentId) {
              const newChildren = [...(node.children || [])];
              if (siblingId) {
                const index = newChildren.findIndex(
                  (child) => child.id === siblingId
                );
                if (index !== -1) {
                  newChildren.splice(index + 1, 0, finalNodeToPaste);
                }
              } else {
                newChildren.push(finalNodeToPaste);
              }
              return { ...node, children: newChildren };
            }
            if (node.children) {
              return { ...node, children: addNodeRecursively(node.children) };
            }
            return node;
          });
        };
        newTree = addNodeRecursively(newTree);
      }

      // 4. Update order indexes
      updateNodeOrderIndexes(newTree);

      return newTree;
    });

    setNodeToCut(null);
  };
  const handleDuplicate = (node: AcademicTreeNode) => {
    const duplicateNodeTree = (
      nodeToDuplicate: AcademicTreeNode
    ): AcademicTreeNode => {
      const newNode: AcademicTreeNode = {
        ...nodeToDuplicate,
        id: uuidv4(),
        scopeId: uuidv4(),
        name: `${nodeToDuplicate.name} (Copy)`,
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: nodeToDuplicate.children
          ? nodeToDuplicate.children.map((child) => duplicateNodeTree(child))
          : [],
      };
      // after creating the new node, we need to update the parentId of its children
      newNode.children.forEach((child) => (child.parentId = newNode.id));
      return newNode;
    };

    const duplicatedNode = duplicateNodeTree(node);

    setTreeData((prevTreeData) => {
      const addSibling = (nodes: AcademicTreeNode[]): AcademicTreeNode[] => {
        const newNodes: AcademicTreeNode[] = [];
        nodes.forEach((n) => {
          newNodes.push(n);
          if (n.id === node.id) {
            newNodes.push(duplicatedNode);
          }
        });
        if (
          node.parentId === null &&
          !newNodes.find((n) => n.id === duplicatedNode.id)
        ) {
          const originalNode = newNodes.find((n) => n.id === node.id);
          if (originalNode) {
            const index = newNodes.indexOf(originalNode);
            newNodes.splice(index + 1, 0, duplicatedNode);
          }
        }
        return newNodes.map((n) => {
          if (n.children) {
            return { ...n, children: addSibling(n.children) };
          }
          return n;
        });
      };

      const newTree = addSibling(prevTreeData);
      updateNodeOrderIndexes(newTree);
      return newTree;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updatedFlatStructure = flattenTree(treeData);

    try {
      const response = await fetch('/api/academic-structure', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFlatStructure, null, 2),
      });

      if (!response.ok) {
        throw new Error('Failed to save academic structure on the server.');
      }

      alert('Academic structure saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('An error occurred while saving the academic structure.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='container mx-auto py-10 text-center'>
        Loading Academic Structure...
      </div>
    );
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='mb-8 text-3xl font-bold'>Academic Structure Editor</h1>

      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button onClick={() => handleAddNode(null, 'degree', 'New Degree')}>
            <Plus className='mr-2 h-4 w-4' /> Add New Degree
          </Button>
          {nodeToCut && (
            <Button onClick={() => handlePaste(null)} variant='secondary'>
              <ClipboardPaste className='mr-2 h-4 w-4' /> Paste at root
            </Button>
          )}
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className='mr-2 h-4 w-4' />{' '}
          {isSaving ? 'Saving...' : 'Save & Backup'}
        </Button>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the node (and its children) as deleted. If
              it's a new, unsynced node, it will be permanently removed. Deleted
              nodes will not appear in the generated JSON.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className='space-y-2 rounded-lg border p-4'
        onClick={() => handleSetActiveNode(null)}
      >
        {treeData.length === 0 && (
          <p className='text-muted-foreground'>
            No academic structure defined. Add a new degree to start.
          </p>
        )}
        {treeData.map((node) => (
          <AcademicNodeItem
            key={node.id}
            node={node}
            level={0}
            onAdd={handleAddNode}
            onUpdate={handleUpdateNode}
            onDelete={handleDeleteNode}
            onToggleCollapse={handleToggleCollapse}
            nodeTypes={nodeTypes}
            onCut={handleCutNode}
            onPaste={handlePaste}
            nodeToCut={nodeToCut}
            onDuplicate={handleDuplicate}
            activeNodeId={activeNodeId}
            onSetActiveNode={handleSetActiveNode}
            ancestorIds={activeNodeAncestors}
          />
        ))}
      </div>
    </div>
  );
};
