import React, { useContext,useState,useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from './ProductItem'
const RelatedProducts = ({category,subCategory}) => {
  const{products}=useContext(ShopContext)
  const [related, setRelated]=useState([])
  
  useEffect(()=>{
    if(products.length>0){
        let productCopy=products.slice()
        productCopy.filter((item)=>category==item.category)
        productCopy.filter((item)=>subCategory==item.subCategory)
        setRelated(productCopy.slice(0,5))
    }
  },[products])
return (
    <div className='my-24'>
        <div className='py-2 text-3xl  text-center'>
            <Title text1={'RELATED'} text2={'PRODUCTS'} />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
            related.map((item,index)=>(
                <ProductItem key={index} name={item.name} price={item.price} image={item.image}/>
            ))
            }
        </div>
        
    </div>
  )
}

export default RelatedProducts