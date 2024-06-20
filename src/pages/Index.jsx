import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
        const topStories = await Promise.all(
          topStoryIds.slice(0, 5).map(async (id) => {
            const { data: story } = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            return story;
          })
        );
        setStories(topStories);
        setFilteredStories(topStories);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    };

    fetchTopStories();
  }, []);

  useEffect(() => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  }, [searchTerm, stories]);

  return (
    <div className={`h-screen w-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl">Hacker News Top Stories</h1>
        <div className="flex items-center">
          <span className="mr-2">Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <div className="space-y-4">
        {filteredStories.map((story) => (
          <Card key={story.id}>
            <CardHeader>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>{story.score} upvotes</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                Read more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;