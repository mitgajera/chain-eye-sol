
import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { knownEntities } from '@/lib/entityDatabase';
import { isValidSolanaAddress } from '@/lib/solana';
import { toast } from '@/hooks/use-toast';
import { Search, Save, Plus, Trash2 } from 'lucide-react';

const EntityLabelingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntities, setFilteredEntities] = useState<typeof knownEntities>(knownEntities);
  const [newEntity, setNewEntity] = useState({
    address: '',
    name: '',
    type: 'exchange'
  });

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredEntities(knownEntities);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = Object.entries(knownEntities).reduce((acc, [address, details]) => {
      if (
        address.toLowerCase().includes(term) ||
        details.name.toLowerCase().includes(term) ||
        details.type.toLowerCase().includes(term)
      ) {
        acc[address] = details;
      }
      return acc;
    }, {} as typeof knownEntities);

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

    // In a real app, this would save to a database
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
                  {Object.entries(filteredEntities).slice(0, 10).map(([address, details]) => (
                    <TableRow key={address}>
                      <TableCell className="font-mono text-xs">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</TableCell>
                      <TableCell>{details.name}</TableCell>
                      <TableCell>{details.type}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {Object.keys(filteredEntities).slice(0, 10).length} of {Object.keys(filteredEntities).length} entities
            </div>
            <Button variant="outline">
              <Save className="h-4 w-4 mr-2" />
              Export Labels
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EntityLabelingPage;
