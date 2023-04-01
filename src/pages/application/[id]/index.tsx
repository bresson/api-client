import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {getApplication, updateApplication, submitApplication} from './../../api'
import {ValidationSchemaType, vehicleApplicationSchema, VehicleType} from './../../../types'


const vehicleFactory = ():VehicleType  => ({
  vin: "",
  year: "",
  make: "",
  model: ""
})

export default function ApplicationPage() {

  const [quote, setQuote] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm<ValidationSchemaType>({
    resolver: zodResolver(vehicleApplicationSchema),
    defaultValues: {
      vehicle: [vehicleFactory()]
    },
    mode: "onBlur"
  });

  const { fields, append, remove } = useFieldArray({
    name: "vehicle",
    control
  });
  
  const onSubmit = async (data: ValidationSchemaType) => {
    try {
      const response = await submitApplication(data);
      const { quote } = await response.json();
      setQuote(quote);

    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

   // Place double awaits inside facade function
  const handleSaveApplication = async (e) => {
    e.preventDefault();
    try {
      await updateApplication(getValues());
    } catch(e) {
      console.error('error saving application:', e)
    }
  }

  useEffect(()=> {
    const abortController = new AbortController();
    (async() => {
      try {
        const {data} = await ((await getApplication()).json() as Promise<{data: ValidationSchemaType}>);
        reset(data)
      } catch(e) {
        console.error('user caught error:', e);
      }
    })()
    return () => abortController.abort();
  }, [reset])

  return (
    <div>
      {quote && <h1> Success! Your Quote: {quote} </h1>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label style={{ display: 'block', marginTop: '24px' }}  htmlFor="firstName">First Name:</label>
        <input {...register("firstName")} id="firstName" placeholder="First Name" />
        {errors.firstName && <p>{errors.firstName.message}</p>}

        <label style={{ display: 'block', marginTop: '24px' }}  htmlFor="lastName">Last Name:</label>
        <input {...register("lastName")} id="lastName" placeholder="Last Name" />
        {errors.lastName && <p>{errors.lastName.message}</p>}

        <label style={{ display: 'block', marginTop: '24px' }}  htmlFor="birthMonth">Birth Month:</label>
        <input {...register("birthMonth")} id="birthMonth"  placeholder="2" />
        {errors.birthMonth && <p>{errors.birthMonth.message}</p>}


        <label style={{ display: 'block', marginTop: '24px' }}  htmlFor="birthDate">Birth Date:</label>
        <input {...register("birthDate")} id="birthDate" placeholder="22" />
        {errors.birthDate && <p>{errors.birthDate.message}</p>}

        <label style={{ display: 'block', marginTop: '24px' }}  htmlFor="birthYear">Birth Year:</label>
        <input {...register("birthYear")} id="birthYear" placeholder="1996" />
        {errors.birthYear && <p>{errors.birthYear.message}</p>}

        {fields.map((field, index) => {
          return (
            <div key={field.id} style={{ display: 'block', marginTop: '24px' }}>
              <section className={"section"} key={field.id}>
              
                <label htmlFor={`vehicle.${index}.vin`}>VIN:</label>
                <input
                  placeholder="VIN"
                  {...register(`vehicle.${index}.vin` as const, {
                    required: true
                  })}
                  className={errors?.vehicle?.[index]?.vin ? "error" : ""}
                  defaultValue={field.vin}
                  style={{ marginRight: '24px' }}
                  id={`vehicle.${index}.vin`}
                />
                {/* Problematic issues with TS, thus the bad below */}
                <span>{errors.vehicle?.[index]?.vin?.message ?? ''}</span>

                

                <label htmlFor={`vehicle.${index}.year`}>Year:</label>
                <input
                  placeholder="Year"
                  type="number"
                  {...register(`vehicle.${index}.year` as const, {
                    required: true
                  })}
                  className={errors?.vehicle?.[index]?.year ? "error" : ""}
                  defaultValue={field.year}
                  style={{ marginRight: '24px' }}
                  id={`vehicle.${index}.year`}
                />
                <span>{errors.vehicle?.[index]?.year?.message ?? ''}</span>

                <label htmlFor={`vehicle.${index}.make`}>Make:</label>
                <input
                  placeholder="Make"
                  type="text"
                  {...register(`vehicle.${index}.make` as const, {
                    required: true
                  })}
                  className={errors?.vehicle?.[index]?.make ? "error" : ""}
                  defaultValue={field.make}
                  style={{ marginRight: '24px' }}
                  id={`vehicle.${index}.make`}
                />
                <span>{errors.vehicle?.[index]?.make?.message ?? ''}</span>

                <label htmlFor={`vehicle.${index}.model`}>Model:</label>
                <input
                  placeholder="Model"
                  type="text"
                  {...register(`vehicle.${index}.model` as const, {
                    required: true
                  })}
                  className={errors?.vehicle?.[index]?.model ? "error" : ""}
                  defaultValue={field.model}
                  style={{ marginRight: '24px' }}
                  id={`vehicle.${index}.model`}
                />
                <span>{errors.vehicle?.[index]?.model?.message ?? ''}</span>

                <button type="button" disabled={fields.length <= 1} onClick={() => remove(index)}>
                  DELETE this vehicle
                </button>
              </section>
            </div>
          );
        })}

        <button
          type="button"
          onClick={() =>
            append(vehicleFactory())
          }
          style={{ display: 'block', marginTop: '24px', 'marginRight': '24px' }}
        >
          Add another vehicle for max of 3
        </button>
        <br />
        <input type="submit" style={{'marginRight': '48px'}} />
        <button onClick={handleSaveApplication}>Save for later!</button>
      </form>
    </div>
  );
}
