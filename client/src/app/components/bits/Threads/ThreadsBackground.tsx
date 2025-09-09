'use client';

import Threads from './Threads';

export default function ThreadsBackground() {
    return (
        <div className='absolute inset-0 z-0'>
            <Threads
                amplitude={1}
                distance={0.1}
                enableMouseInteraction={true}
                className='h-full w-full'
            />
        </div>
    );
}
