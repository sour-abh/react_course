import React,{useCallback} from 'react'
import {useForm} from 'react-hook-form'
import {Button,Input,Select,RTE} from '../index'
import appwriteService from '../../appwrite/config'
import {useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

function Postform({post}) {

    const {register, handleSubmit, watch, setValue, control, getValues}=useForm({

        defaultValues:{
            title:post?.title||'',
            slug:post?.slug || '',
            content: post?.content || "",
            status:post?.status || 'active',

        }
    }
    )
    const navigate=useNavigate()
    const userData= useSelector((state) => state.auth.userData)
    console.log(userData)
    const submit = async (data) => {
        let file = null;
        
        try {
            // If a new image is chosen, upload it
            if (data.image?.[0]) {
                console.log("PostForm :: uploading new image", {
                    fileName: data.image[0].name,
                    fileSize: data.image[0].size,
                    fileType: data.image[0].type,
                    timestamp: new Date().toISOString()
                });
                file = await appwriteService.uploadFile(data.image[0]);
                console.log("PostForm :: image uploaded successfully", {
                    fileId: file.$id,
                    timestamp: new Date().toISOString()
                });
            }
            
            if (post) {
                // Edit flow: post exists
                if (file) {
                    // Delete old image if new file is uploaded
                    console.log("PostForm :: deleting old image", {
                        oldFileId: post.FeaturedImage,
                        newFileId: file.$id,
                        postId: post.$id,
                        timestamp: new Date().toISOString()
                    });
                    await appwriteService.deleteFile(post.FeaturedImage);
                }
                
                console.log("PostForm :: updating post", {
                    postId: post.$id,
                    title: data.title,
                    status: data.status,
                    featuredImage: file ? file.$id : post.FeaturedImage,
                    userId: userData.$id,
                    timestamp: new Date().toISOString()
                });
                
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    FeaturedImage: file ? file.$id : post.FeaturedImage,
                    userId: userData.$id
                });
                
                if (dbPost) {
                    console.log("PostForm :: post updated successfully", {
                        postId: dbPost.$id,
                        timestamp: new Date().toISOString()
                    });
                    navigate(`/post/${dbPost.$id}`);
                    return true;
                } else {
                    console.error("PostForm :: post update returned null/false", {
                        postId: post.$id,
                        timestamp: new Date().toISOString()
                    });
                    return false;
                }
            } else {
                // Create flow: new post
                if (!file) {
                    console.error('PostForm :: image is required for new posts', {
                        title: data.title,
                        userId: userData.$id,
                        timestamp: new Date().toISOString()
                    });
                    return false;
                }
                
                console.log("PostForm :: creating new post", {
                    title: data.title,
                    slug: data.slug,
                    status: data.status,
                    featuredImage: file.$id,
                    userId: userData.$id,
                    timestamp: new Date().toISOString()
                });
                
                const dbPost = await appwriteService.createPost({
                    ...data,
                    FeaturedImage: file.$id,
                    userId: userData.$id
                });
                
                if (dbPost) {
                    console.log("PostForm :: post created successfully", {
                        postId: dbPost.$id,
                        timestamp: new Date().toISOString()
                    });
                    navigate(`/post/${dbPost.$id}`);
                    return true;
                } else {
                    console.error("PostForm :: post creation returned null/false", {
                        slug: data.slug,
                        fileId: file.$id,
                        timestamp: new Date().toISOString()
                    });
                    return false;
                }
            }
        } catch (error) {
            console.error('PostForm :: error submitting post', {
                error: error.message,
                stack: error.stack,
                postId: post?.$id,
                title: data?.title,
                slug: data?.slug,
                fileId: file?.$id,
                userId: userData?.$id,
                isEditMode: !!post,
                timestamp: new Date().toISOString()
            });
            
            // Clean up uploaded file if post creation/update fails
            if (file && !post) {
                try {
                    console.log("PostForm :: cleaning up uploaded file due to error", {
                        fileId: file.$id,
                        timestamp: new Date().toISOString()
                    });
                    await appwriteService.deleteFile(file.$id);
                } catch (deleteError) {
                    console.error("PostForm :: failed to cleanup uploaded file", {
                        error: deleteError.message,
                        fileId: file.$id,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            
            throw new Error(`Post submission failed: ${error.message}`);
        }
    }

    const slugTransform= useCallback((value)=>{
        if(value && typeof value ==='string'){
            return value
            .trim()
            .toLowerCase()
            .replace(/\s/g,'-')
        }
        return ""
    },[])
    React.useEffect(()=>{
        const subscription= watch((value,{name})=>{ if (name === 'title'){
            setValue('slug', slugTransform((value.title),{shouldValidate:true}))
        }})


        return ()=>{
            subscription.unsubscribe()
        }

    },[watch,slugTransform,setValue])
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title" name="title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        {console.log(post.FeaturedImage)}
                        <img
                            src={appwriteService.getFilePreview(post.FeaturedImage)}
                            alt={post.Title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}

export default Postform