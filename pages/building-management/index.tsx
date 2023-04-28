import React from 'react'
import DefaultLayout from '../../components/Layouts/DefaultLayouts'

type Props = {}

const BuildingManagement = (props: Props) => {
  return (
    <DefaultLayout>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet, fugiat.</div>
      </div>

      <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, reiciendis!</div>
        <div className='col-span-12 xl:col-span-8'>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, voluptates.</div>
        </div>
        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga, dicta.</div>
      </div>
    </DefaultLayout>
  )
}

export default BuildingManagement;