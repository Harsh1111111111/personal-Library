import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../config';

// --- Configuration ---
// Replace '' with your actual backend server URL


// --- Type Definitions ---
interface CardProps {
    title: string;
    link: string;
    type: 'youtube' | 'tweet' | string; // Allow other string types as well
}

interface ContentItem {
    type: 'youtube' | 'tweet' | string;
    link: string;
    title: string;
}

interface UserData {
    username: string;
    content: ContentItem[];
}

// --- Reusable UI Components ---

// --- Icons (as placeholder SVGs) ---
const ShareIcon: React.FC<{ size?: string }> = ({ size = "md" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
);
const CrossIcon: React.FC<{ size?: string }> = ({ size = "md2" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);


// --- Your new Card component, adapted for the public share page ---
const Card: React.FC<CardProps> = ({ title, link, type }) => {
    // This effect is necessary to load Twitter's script to render embedded tweets
    useEffect(() => {
        if (type === 'tweet') {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            document.body.appendChild(script);

            // Cleanup function to remove the script when the component unmounts
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [type]);

    const defaultStyles = "p-6 bg-white rounded-lg shadow-md border-gray-100 w-full border";
    const foricons = "text-gray-500";
   
    return (
        <div className={defaultStyles}>
            <div className="flex justify-between items-center">
                <div className="flex items-center text-md font-bold text-slate-800"> 
                    <div className="text-gray-500 pr-2"><ShareIcon size="md"/></div>
                    {title}
                </div>    
                <div className="flex items-center">
                    <div className={`pr-2 ${foricons}`}>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                             <ShareIcon size="md"/> 
                        </a>
                    </div>
                    {/* The delete icon is removed from the public, read-only view */}
                </div>
            </div>

            <div className="pt-4">
                {/* For YouTube video */}
                {type === "youtube" && 
                <iframe 
                    className="w-full h-48 rounded-md"
                    src={link.replace("watch?v=", "embed/")} 
                    title="Youtube Video Player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen>
                </iframe>
                }

                {/* For Tweet */}
                {type === "tweet" &&  
                <blockquote className="twitter-tweet" data-dnt="true" data-theme="light">
                    <a href={link.replace("x.com", "twitter.com")}>Loading Tweet...</a>
                </blockquote>
                }
            </div>
        </div>
    );
};


// Loading spinner to show while data is being fetched
const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <style>{`
            @keyframes spin { 
                to { transform: rotate(360deg); } 
            } 
            .animate-spin { 
                animation: spin 1s linear infinite; 
            }
        `}</style>
    </div>
);

// --- Main Page Component ---
export const SharedContentPage: React.FC = () => {
    const { shareLink } = useParams<{ shareLink: string }>(); 
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!shareLink) {
            setError("No share link was found in the URL.");
            setLoading(false);
            return;
        }

        const fetchSharedContent = async () => {
            try {
                const response = await axios.get<UserData>(`${BACKEND_URL}/api/v1/library/share/${shareLink}`);
                setUserData(response.data);
            } catch (err: any) {
                console.error("Failed to fetch shared content:", err);
                setError(err.response?.data?.message || "Could not load the shared library. The link may be invalid or expired.");
            } finally {
                setLoading(false);
            }
        };

        fetchSharedContent();
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
             <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center shadow-md">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <main className="max-w-4xl mx-auto">
                {userData && (
                    <>
                        <header className="pb-6 border-b border-slate-200 text-center">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                                    <span className="text-blue-600">{userData.username}'s</span> Brain
                                </h1>
                                <p className="mt-2 text-sm text-slate-600">
                                    A collection of curated links and resources.
                                </p>
                            </div>
                        </header>

                        {userData.content && userData.content.length > 0 ? (
                             <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                {userData.content.map((item, index) => (
                                    <Card
                                        key={index}
                                        type={item.type}
                                        link={item.link}
                                        title={item.title}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-8 text-center py-16 bg-white rounded-lg border">
                                <h3 className="text-lg font-semibold text-slate-700">This brain is empty!</h3>
                                <p className="text-slate-500 mt-2">There is no content to display here yet.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
