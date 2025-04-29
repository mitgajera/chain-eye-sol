
import { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { knownEntities } from '@/lib/entityDatabase';
import { isValidSolanaAddress } from '@/lib/solana';
import { toast } from '@/hooks/use-toast';
import { Search, Save, Plus, Trash2, Pencil, AlertCircle } from 'lucide-react';

// Define the entity type
interface Entity {
  address: string;
  name: string;
  type: string;
}

const EntityLabelingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntities, setFilteredEntities] = useState<Record<string, { name: string, type: string }>>({});
  const [entities, setEntities] = useState<Record<string, { name: string, type: string }>>({});
  const [newEntity, setNewEntity] = useState({
    address: '',
    name: '',
    type: 'exchange'
  });
  const [editEntity, setEditEntity] = useState<Entity | null>(null);
  const [deleteEntityAddress, setDeleteEntityAddress] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load entities from localStorage on component mount
  useEffect(() => {
    const savedEntities = localStorage.getItem('knownEntities');
    const initialEntities = savedEntities ? JSON.parse(savedEntities) : knownEntities;
    setEntities(initialEntities);
    setFilteredEntities(initialEntities);
  }, []);

  // Save entities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('knownEntities', JSON.stringify(entities));
  }, [entities]);

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredEntities(entities);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = Object.entries(entities).reduce((acc, [address, details]) => {
      if (
        address.toLowerCase().includes(term) ||
        details.name.toLowerCase().includes(term) ||
        details.type.toLowerCase().includes(term)
      ) {
        acc[address] = details;
      }
      return acc;
    }, {} as Record<string, { name: string, type: string }>);

    setFilteredEntities(filtered);
  };

  const handleAddEntity = () => {
    if (!newEntity.address || !newEntity.name || !newEntity.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (!isValidSolanaAddress(newEntity.address)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Solana address",
        variant: "destructive"
      });
      return;
    }

    // Check if entity already exists
    if (entities[newEntity.address]) {
      toast({
        title: "Entity exists",
        description: "An entity with this address already exists",
        variant: "destructive"
      });
      return;
    }

    // Add new entity
    const updatedEntities = {
      ...entities,
      [newEntity.address]: {
        name: newEntity.name,
        type: newEntity.type
      }
    };

    setEntities(updatedEntities);
    setFilteredEntities(updatedEntities);
    
    toast({
      title: "Entity saved",
      description: `Added ${newEntity.name} as a ${newEntity.type}`,
    });

    // Reset form
    setNewEntity({
      address: '',
      name: '',
      type: 'exchange'
    });
  };

  const handleEditClick = (address: string) => {
    const entity = entities[address];
    setEditEntity({
      address,
      name: entity.name,
      type: entity.type
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateEntity = () => {
    if (!editEntity) return;
    
    if (!editEntity.name || !editEntity.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Update entity
    const updatedEntities = {
      ...entities,
      [editEntity.address]: {
        name: editEntity.name,
        type: editEntity.type
      }
    };

    setEntities(updatedEntities);
    setFilteredEntities(updatedEntities);
    
    toast({
      title: "Entity updated",
      description: `Updated ${editEntity.name}`,
    });

    // Close dialog and reset edit entity
    setIsEditDialogOpen(false);
    setEditEntity(null);
  };

  const handleDeleteClick = (address: string) => {
    setDeleteEntityAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteEntity = () => {
    if (!deleteEntityAddress) return;
    
    // Create a copy of entities without the deleted one
    const { [deleteEntityAddress]: deletedEntity, ...remainingEntities } = entities;
    
    setEntities(remainingEntities);
    setFilteredEntities(remainingEntities);
    
    toast({
      title: "Entity deleted",
      description: `Deleted ${deletedEntity.name}`,
    });

    // Close dialog and reset delete address
    setIsDeleteDialogOpen(false);
    setDeleteEntityAddress(null);
  };

  const handleExportLabels = () => {
    const dataStr = JSON.stringify(entities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'entity-labels.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Labels exported",
      description: "Entity labels have been exported to a JSON file",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Entity Labeling</h1>

        <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Add New Entity</CardTitle>
            <CardDescription>
              Add known addresses to improve transaction labeling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entity-address">Solana Address</Label>
                <Input
                  id="entity-address"
                  placeholder="Enter Solana address"
                  value={newEntity.address}
                  onChange={(e) => setNewEntity({...newEntity, address: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-name">Entity Name</Label>
                <Input
                  id="entity-name"
                  placeholder="e.g. Binance Hot Wallet"
                  value={newEntity.name}
                  onChange={(e) => setNewEntity({...newEntity, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-type">Entity Type</Label>
                <Select value={newEntity.type} onValueChange={(value) => setNewEntity({...newEntity, type: value})}>
                  <SelectTrigger id="entity-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="marketplace">NFT Marketplace</SelectItem>
                    <SelectItem value="defi">DeFi Protocol</SelectItem>
                    <SelectItem value="staking">Staking Service</SelectItem>
                    <SelectItem value="bridge">Bridge</SelectItem>
                    <SelectItem value="system">System Program</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddEntity} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Entity
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Known Entities</CardTitle>
            <CardDescription>
              Search and manage known entities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
              <Input
                placeholder="Search by address, name or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button type="submit" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Address</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(filteredEntities).length > 0 ? (
                    Object.entries(filteredEntities).slice(0, 10).map(([address, details]) => (
                      <TableRow key={address}>
                        <TableCell className="font-mono text-xs">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</TableCell>
                        <TableCell>{details.name}</TableCell>
                        <TableCell>{details.type}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => handleEditClick(address)}>
                              <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(address)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        No entities found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {Object.keys(filteredEntities).slice(0, 10).length} of {Object.keys(filteredEntities).length} entities
            </div>
            <Button variant="outline" onClick={handleExportLabels}>
              <Save className="h-4 w-4 mr-2" />
              Export Labels
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Entity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Entity</DialogTitle>
            <DialogDescription>
              Update the entity information
            </DialogDescription>
          </DialogHeader>
          {editEntity && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editEntity.address}
                  readOnly
                  className="bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editEntity.name}
                  onChange={(e) => setEditEntity({...editEntity, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={editEntity.type} onValueChange={(value) => setEditEntity({...editEntity, type: value})}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exchange">Exchange</SelectItem>
                    <SelectItem value="marketplace">NFT Marketplace</SelectItem>
                    <SelectItem value="defi">DeFi Protocol</SelectItem>
                    <SelectItem value="staking">Staking Service</SelectItem>
                    <SelectItem value="bridge">Bridge</SelectItem>
                    <SelectItem value="system">System Program</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateEntity}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entity? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEntity}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EntityLabelingPage;
