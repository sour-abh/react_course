import React from 'react'
import {Editor} from '@tinymce/tinymce-react';
import {Controller} from "react-hook-form"


export default function RTE({name,control,label}) {




  return (
    <div className='w-full'>
        {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

        <Controller
        name={name||"content"}
        control={control}
        render={({field:{onChange}})=>(
            
            
    <Editor
    apiKey="sxlgpskq36sz0xad9i4u583wrmqiza4av7rz5q9w2jnnfm1p"
    initialValue='default value'
    init={{
        branding:false,
        height:500,
        menubar:true,
        plugins:[
'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
          // Your account includes a free trial of TinyMCE premium features
          // Try the most popular premium features until Jul 18, 2025:
          'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate',  'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
        ],
        toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | remove format | help',

        content_style:"body {font-family:Helvetica, Arial, sans-serif; font-size:14px}"
        
    }}
    onEditorChange={onChange}
    
    />

        )}
        
        />
    </div>











  )
}
