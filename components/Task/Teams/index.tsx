import React from 'react'
import { colorfull } from '../../../utils/useHooks/useFunction';

type TeamProps = {
    items: any
}

export default function Teams({ items }: TeamProps) {
    const index = [0, 1, 3];

    return (
        <div className="w-full text-sm text-gray-500">
            <div className='w-full flex gap-2 items-center'>
                <div className='w-full max-w-max flex items-center ml-2 -space-x-4'>
                    {items?.length > 3 ?
                        <React.Fragment>
                            {index?.map((val, idx) => {
                                return (
                                    <button
                                        key={idx}
                                        type='button'
                                        className="group relative inline-flex text-blue-500 hover:text-red-500 duration-300">
                                        {items[val]?.profileImage ?
                                            <img
                                                src={items[val]?.profileImage}
                                                alt="images"
                                                className='border rounded-full w-10 h-10 object-cover object-center'
                                            />
                                            : <div style={{ backgroundColor: `#${colorfull(items[val]?.id)}` }} className='border rounded-full flex items-center justify-center w-10 h-10 text-[10px] uppercase font-bold text-white'>
                                                {items[val]?.firstName || items[val]?.lastName ?
                                                    items[val]?.firstName?.charAt(0) + items[val]?.lastName?.charAt(0) :
                                                    null
                                                }
                                            </div>
                                        }
                                        <span className="text-xs absolute hidden group-hover:flex -left-[0.5rem] -top-2 -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                            {`${items[val]?.firstName} ${items[val]?.lastName}`}
                                        </span>
                                    </button>

                                )
                            })}
                        </React.Fragment> : items?.length == 0 ?
                            <div className='font-bold text-gray-5'>
                                Teams hasn't any member
                            </div> :
                            <React.Fragment>
                                {index?.map((val, idx) => {
                                    console.log(items[val]?.id, 'id')
                                    if (items[val]?.id) {
                                        return (
                                            <button
                                                key={idx}
                                                type='button'
                                                className="group relative inline-flex text-blue-500 hover:text-red-500 duration-300">
                                                {items[val]?.profileImage ?
                                                    <img
                                                        src={items[val]?.profileImage}
                                                        alt="images"
                                                        className='border rounded-full w-10 h-10 object-cover object-center'
                                                    />
                                                    : <div style={{ backgroundColor: `#${colorfull(items[val]?.id)}` }} className='border rounded-full flex items-center justify-center w-10 h-10 text-[10px] uppercase font-bold text-white'>
                                                        {items[val]?.firstName || items[val]?.lastName ?
                                                            items[val]?.firstName?.charAt(0) + items[val]?.lastName?.charAt(0) :
                                                            null
                                                        }
                                                    </div>
                                                }
                                                <span className="text-xs absolute hidden group-hover:flex -left-[0.5rem] -top-2 -translate-y-full px-2 py-1 bg-gray-700 rounded-lg text-center text-white after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                                                    {`${items[val]?.firstName} ${items[val]?.lastName}`}
                                                </span>
                                            </button>

                                        )
                                    }
                                })}
                            </React.Fragment>
                    }
                </div>
                {items?.length > 2 ?
                    <div className='w-full flex'>
                        <p>
                            <span className='font-semibold'>{`${items[0].firstName}, ${items[1].firstName}`}</span>
                            <span>{`${items?.length - 2 == 0 ? "" : items.length - 2 == 1 ? ` and +${items.length} other` : ` and +${items.length} others`}`}</span>
                        </p>

                    </div>
                    : items?.length == 0 ? null :
                        <div className='w-full flex'>
                            <p className='flex gap-2'>
                                {index.map((e: any, i: any) => (
                                    <span key={i} className='font-semibold'>{items[i].firstName},</span>
                                ))}
                            </p>

                        </div>
                }
            </div>
        </div>
    )
};
