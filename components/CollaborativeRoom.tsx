'use client'
import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import { useEffect, useRef, useState } from 'react'
import { Editor } from "@/components/editor/Editor";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/rooms.actions';
import Loader from './Loader';

const CollaborativeRoom = ({ roomId, roomMetadata }: CollaborativeRoomProps) => {

    const currentUserType = 'editor'
    const [docTitle, setDocTitle] = useState(roomMetadata.title)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLDivElement>(null)

    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true)
            try {
                if (docTitle !== roomMetadata.title) {
                    const updatedDoc = await updateDocument(roomId, docTitle)
                    if (updatedDoc)
                        setEditing(false)
                }

            } catch (error) {
                console.log(`Error while updating title: ${error}`)
            }
            setLoading(false)
        }

    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setEditing(false)
                updateDocument(roomId, docTitle)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [roomId, docTitle])

    useEffect(() => {
        if (editing && inputRef.current)
            inputRef.current.focus()
    }, [editing])

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader />}>
                <div className="collaborative-room">
                    <Header>
                        <div ref={containerRef} className="flex w-fit items-center justify-center gap-2">
                            {editing && !loading ?
                                (<Input
                                    type='text'
                                    ref={inputRef}
                                    placeholder='Enter Title'
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    onKeyDown={updateTitleHandler}
                                    disable={!editing}
                                    className='document-title-input'
                                />)
                                :
                                (<>
                                    <p className='document-title'>{docTitle}</p>
                                </>)}
                            {currentUserType === 'editor' && !editing && (
                                <Image
                                    src='/assets/icons/edit.svg'
                                    alt='edit'
                                    width={24}
                                    height={24}
                                    onClick={() => setEditing(true)}
                                    className='pointer'
                                />
                            )}

                            {currentUserType !== 'editor' && !editing && (
                                <p className='view-only-tag'>View Only</p>)
                            }
                            {loading && <p className='text-sm text-gray-400'>Saving...</p>}
                        </div>
                        <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                            <ActiveCollaborators />
                            <SignedOut>
                                <SignInButton />
                            </SignedOut>
                            <SignedIn>
                                <UserButton />
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor />
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    )
}

export default CollaborativeRoom