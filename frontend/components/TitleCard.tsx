"use client"

import React from 'react';


interface TitleCardProps {
    title: string;
    onClick?: () => void;
}

const TitleCard = ({ title, onClick }: TitleCardProps) => {

    return (
        <div className='bg-myred rounded-2xl w-full p-8 flex cursor-pointer' onClick={onClick}>
            <div className='flex items-center justify-center w-full'>
                <p className='font-bold text-lg text-white'>{title}</p>
            </div>
        </div>
    )

}

export default TitleCard;
