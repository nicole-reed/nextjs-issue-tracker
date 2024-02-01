'use client'
import { Button, Callout, Text, TextField } from '@radix-ui/themes'
import SimpleMDE from 'react-simplemde-editor';
import { useForm, Controller } from 'react-hook-form';
import 'easymde/dist/easymde.min.css';
import axios from 'axios';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    // react-hook form
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        // integrate with zod
        resolver: zodResolver(createIssueSchema)
    });
    const [error, setError] = useState('')


    return (
        <div className='max-w-xl'>
            {error && <Callout.Root color='red' className='mb-3'>
                <Callout.Text>{error}</Callout.Text>
            </Callout.Root>}
            <form className='space-y-3'
                onSubmit={handleSubmit(async (data) => {
                    try {
                        await axios.post('/api/issues', data);
                        router.push('/issues')
                    } catch (error) {
                        setError('An unexpected error has occured')
                    }
                })}>
                <TextField.Root>
                    <TextField.Input placeholder='Title' {...register('title')} />
                </TextField.Root>
                {errors.title && <Text color='red' as='p'> {errors.title.message}</Text>}
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => <SimpleMDE placeholder='Description…' {...field} />}
                />
                {errors.description && <Text color='red' as='p'></Text>}
                <Button>Submit New Issue</Button>
            </form>
        </div>
    )
}

export default NewIssuePage