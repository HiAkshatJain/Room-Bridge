import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChat } from '@/contexts/ChatContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Search,
  Users,
  Plus,
  Filter,
  Clock,
  MessageCircle,
  Lock,
  Globe,
} from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { rooms, searchRooms, isLoadingRooms } = useChat();

  const filteredRooms = searchQuery ? searchRooms(searchQuery) : rooms;
  
  const allRooms = filteredRooms;
  const publicRooms = filteredRooms.filter(room => !room.isPrivate);
  const privateRooms = filteredRooms.filter(room => room.isPrivate);

  const getRoomsForTab = () => {
    switch (activeTab) {
      case 'public':
        return publicRooms;
      case 'private':
        return privateRooms;
      default:
        return allRooms;
    }
  };

  const currentRooms = getRoomsForTab();

  const RoomCardSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover Rooms</h1>
          <p className="text-muted-foreground">
            Find the perfect community for your interests
          </p>
        </div>
        <Button className="mt-4 md:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Create Room
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Rooms ({allRooms.length})</TabsTrigger>
          <TabsTrigger value="public">
            <Globe className="w-4 h-4 mr-2" />
            Public ({publicRooms.length})
          </TabsTrigger>
          <TabsTrigger value="private">
            <Lock className="w-4 h-4 mr-2" />
            Private ({privateRooms.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoadingRooms ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : currentRooms.length === 0 ? (
            <Card>
              <CardContent className="pt-8 pb-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No rooms found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Be the first to create a room!"}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRooms.map(room => (
                <Card key={room.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <img
                      src={room.avatar}
                      alt={room.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold leading-tight">
                        {room.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {room.memberCount} members
                      </CardDescription>
                    </div>
                    {room.isPrivate && (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {room.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1 inline" />
                      {new Date(room.createdAt).toLocaleDateString()}
                    </div>
                    <Link to={`/chat?roomId=${room.id}`}>
                      <Button>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};