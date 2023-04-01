import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 

  /*

  architecture = [
      {
      name: 'colors',
      type: 'select',
      label: 'Colors',
      required: true,
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
      ],
    }
  ]


  */


function AutoForm({ architecture, web3Store, onSubmit }) {
  const [formData, setFormData] = useState({});

  /*
  this updates our formdata from simple components like <input>
  */
  const handleChange = (event) => {
    
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  /*
  this updates our formdata from advanced custom components
  */
  const handleUpdate = (key, val) => {
    
    setFormData({
      ...formData,
      [key]:val,
    });
 

  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {architecture.fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label htmlFor={field.name} className="block text-gray-700 font-bold mb-2">
            {field.label}
          </label>
         


            {/*custom component support*/}
          {typeof field.type != 'string' && (
            <field.type
              name={field.name}
              id={field.name}
              required={field.required}
              web3Store={web3Store}
          //    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          //    value={formData[field.name] || ''}
              onUpdated={handleUpdate}
            >
              
            </field.type>
          )}
          

          {field.type === 'text' && (
            <input
              type="text"
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}

           {field.type === 'select' && (
            <select
              name={field.name}
              id={field.name}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}


        {field.type === 'number' && (
            <input
              type="number"
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}

        {field.type === 'color' && (
            <input
              type="color"
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}        

        {field.type === 'file' && (
            <input
              type="file"
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}        


         {field.type === 'date' && (
            <input
              type="date"
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              name={field.name}
              id={field.name}
              placeholder={field.placeholder}
              required={field.required}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          )}
        </div>
      ))}

      <div className="flex flex-row">
        <div className="flex-grow"></div>
        <button
            type="submit"
            className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
           Submit
        </button>
      </div>

    </form>
  );
}



export default observer(AutoForm);