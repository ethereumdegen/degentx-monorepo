import { useState } from 'react';

import { observer } from "mobx-react";

import {
    Lucide, 
  } from "@/base-components";
 


function AutoForm({ architecture, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
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