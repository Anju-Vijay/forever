import React, {useContext,useEffect,useState} from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { assets } from '../assets/assets'

const Collections = () => {
  const {products}=useContext(ShopContext)
  const [filterProducts,setFilterProducts]=useState([])
  const [showFilter, setShowFilter]=useState(false)
  const [category,setCategory]=useState([])
  const [subCategory, setSubCategory]=useState([])
  const [sortType, setSortType]=useState('relevent')
  const toggleCategory=(e)=>{
    if(category.includes(e.target.value)){
      setCategory(prev=>prev.filter(item=>item !==e.target.value))
    }else{
      setCategory(prev=>[...prev,e.target.value])
    }
  }

  const toggleSubCategory=(e)=>{
    if(subCategory.includes(e.target.value)){
      setSubCategory(prev=>prev.filter(item=>item !== e.target.value))
    }else{
      setSubCategory(prev=>[...prev,e.target.value])
    }
  }

  const applyFilter=()=>{
    let productCopy=products.slice()
    if(category.length > 0){
      productCopy=productCopy.filter(item=> category.includes(item.category))
    }
    if(subCategory.length>0){
      productCopy=productCopy.filter(item=>  subCategory.includes(item.subCategory))
    }
    setFilterProducts(productCopy)
  }
  const sortProduct=()=>{
    const fpCopy=filterProducts.slice()
    switch(sortType){
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price-b.price)))
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price-a.price)))
        break;

      default:
        applyFilter()
    }
  }
  useEffect(()=>{
    applyFilter()
  },[category,subCategory])

  useEffect(()=>{
    sortProduct()
  },[sortType])


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter options*/}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter? 'rotate-90':''}`} src={assets.dropdown_icon}/>
        </p>
        {/*Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Men'} onChange={toggleCategory}/>Men</p>
            <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Women'} onChange={toggleCategory}/>Women</p>
            <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Kids'} onChange={toggleCategory}/>Kid</p>
          </div>
        </div>
        {/* subcategory filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>Type</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
          <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Topwear'} onChange={toggleSubCategory}/>Topwear</p>
          <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Bottomwear'} onChange={toggleSubCategory} />Bottomwear</p>
          <p className='flex gap-2'><input className='w-3' type='checkbox' value={'Winterwear'} onChange={toggleSubCategory}/>WinterWear</p>
          </div>
        </div>
      </div>
      {/* Right side */}
      <div className='flex-1'>
          <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'}/>
            {/*Products sort */}
              <select onChange={(e)=>setSortType(e.target.value)} className='border border-gray-300 text-sm px-2'>
                <option value='relavent'>Sort by: Relevence</option>
                <option value='low-high'>Sort by: Low to high</option>
                <option value='high-low'>Sort by: High to low</option>
              </select>
          </div>
          {/* Map Products */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {
              filterProducts.map((item, index)=>(
                <ProductItem key={index} id={item._id} name={item.name} price={item.price} image={item.image}/>
              ))
            }
            
          </div>
        
      </div>

    </div>
  )
}

export default Collections