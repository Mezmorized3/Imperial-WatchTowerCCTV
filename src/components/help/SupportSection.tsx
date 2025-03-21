
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, MessageSquare } from 'lucide-react';

const SupportSection = () => {
  return (
    <Card className="bg-scanner-card border-gray-700">
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <CardDescription className="text-gray-400">
          Need additional help? Our support team is here to help you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-800 p-6 rounded-lg">
            <BookOpen className="h-8 w-8 text-scanner-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Documentation</h3>
            <p className="text-gray-400 mb-4">
              Explore our comprehensive documentation for detailed guides and references.
            </p>
            <Button className="w-full">Browse Documentation</Button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <MessageSquare className="h-8 w-8 text-scanner-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Live Chat</h3>
            <p className="text-gray-400 mb-4">
              Chat with our support team for immediate assistance with your questions.
            </p>
            <Button className="w-full">Start Chat</Button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Submit a Support Ticket</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" className="bg-gray-700" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" className="bg-gray-700" placeholder="Your email" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" className="bg-gray-700" placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>
            <Button className="w-full">Submit Ticket</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportSection;
