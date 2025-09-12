import { Button } from '../components/ui/Button';
import { PlusIcon } from '../icons/plus';
import { ShareIcon } from '../icons/share';
import { Card } from '../components/ui/Card';
import { useState } from 'react';
import { CreateContentModel } from '../components/ui/CreateContentModel';
import { Sidebar } from '../components/ui/Sidebar';
import { useContent } from '../hooks/useContent';



export function Dashboard() {
  const [modelOpen, setModalOpen] = useState(false);
  const {content} = useContent(); 

 
  return (

    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />


       <CreateContentModel 
        open={modelOpen} 
        onClose={() => setModalOpen(false)} 
      /> 


      <main className="flex-1 p-8 ml-72">
        
        <header className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Content</h1>
            <p className="mt-1 text-sm text-slate-600">
              A collection of your curated links and resources.
            </p>
          </div>
          <div className="flex items-center gap-x-4">
            <Button 
              onClick={() => {
                
              }}
              startIcon={<ShareIcon size="md" />} 
              variant="primary" 
              size="sm" 
              text="Share Brain" 
            />
            <Button
              startIcon={<PlusIcon size="md" />}
              variant="secondary"
              size="md"
              text="Add Content"
              onClick={() => { setModalOpen(true) }}
            />
          </div>
        </header>

        {/* A responsive grid for displaying the content cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {content.map(({ title, link, type }) => (
            <Card
              type={type}
              link={link}
              title={title}
            />
          ))}
        </div>
        
      </main>
    </div>
  );
}