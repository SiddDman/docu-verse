'use server'

import { nanoid } from 'nanoid'
import { liveblocks } from '../liveblocks';
import { revalidatePath } from 'next/cache';
import { parseStringify } from '../utils';
import clsx from 'clsx';

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
            defaultAccesses: ['room:write']
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
        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        // if (!hasAccess)
        //     throw new Error('You do not have access to this document!')

        return parseStringify(room)
    } catch (error) {
        console.log(`Error in getting a room : ${error}`)
    }

}