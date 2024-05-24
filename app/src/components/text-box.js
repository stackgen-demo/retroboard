import React from 'react'

const TextBox = ({ label, ...props }) => {
    console.log('props-4::> ', props)
    return (
        <div className='flex flex-col'>
            {label && <label
                htmlFor={props.name}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {label}
            </label>}
            <input type="text" className="bg-transparent p-1.5 tw-text-sm text-gray-900 placeholder:text-gray-400 placeholder:tw-text-sm  border border-gray-700 rounded-md w-full" {...props} />
        </div>
    )
}
export default TextBox