'use server'

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { getAccessType, parseStringify } from '../utils';
import { redirect } from 'next/navigation'
import { AwardIcon } from 'lucide-react';
import { title } from 'process';

export const createDocument = async ({ userId, email }: CreateDocumentParams) => {
    const roomId = nanoid()

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: 'Untitled Document'
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: []
        });
        revalidatePath('/')
        return parseStringify(room)
    } catch (error) {
        console.log(`Error while creating Room : ${error}`)
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string, userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        if (!hasAccess)
            throw new Error('You do not have access to this document!')

        return parseStringify(room)
    } catch (error) {
        console.log(`Error in getting a room : ${error}`)
    }
}

export const getDocuments = async (email: string) => {
    try {
        const rooms = await liveblocks.getRooms({ userId: email })
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        // if (!hasAccess)
        //     throw new Error('You do not have access to this document!')

        return parseStringify(rooms)
    } catch (error) {
        console.log(`Error in retrieving a rooms : ${error}`)
    }
}

export const updateDocument = async (roomId: string, title: string) => {
    try {
        const updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updateDocument)
    } catch (error) {
        console.log(`Error while updating room title: ${error}`)
    }
}

export const updateDocAccess = async ({ roomId, email, userType, updatedBy }: ShareDocumentParams) => {
    try {
        const usersAccesses: RoomAccesses = {
            [email]: getAccessType(userType) as AccessType,
        }
        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses
        })
        if (room) {
            const notificationId = nanoid()

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have been granted ${userType} access to the document by ${updatedBy.name}.`,
                    updatedBy: updatedBy.name,
                    avatar: updatedBy.avatar,
                    email: updatedBy.email
                },
                roomId
            })
        }

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room)

    } catch (error) {
        console.log(`Error while updating room access for a user: ${error}`)
    }
}

export const removeCollaborator = async ({ roomId, email }: { roomId: string, email: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId)
        if (room.metadata.email === email)
            throw new Error('You cannot remove yourself as a collaborator from the Doc')
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)

    } catch (error) {
        console.log(`Error while removing a user:${error}`)
    }
}

export const deleteDoc = async (roomId: string) => {
    try {
        await liveblocks.deleteRoom(roomId)
        revalidatePath('/')
        redirect('/')
    } catch (error) {
        console.log(`Error while deleting room:${error}`)
    }
}