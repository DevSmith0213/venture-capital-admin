/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import axios from "axios";
import { Form, message, Button, Input, Select, Spin } from 'antd';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { uploadFileHandler } from '@/utils/firebaseQuery';

const { Option } = Select;

const CreateBlog = ({ route }: any) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [type, setType] = useState("");
  const [id, setId] = useState("");
  const [blogInfo, setBlogInfo] = useState<any>({});
  const [tagsFromServer, setTagsFromServer] = useState<any>([]);
  const [categoryFromServer, setCategoryFromServer] = useState<any>([]);
  const [uploadedImages, setUploadedImages] = useState<any>([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState<boolean>(false);

  const onEditorStateChange = (editorState: any) => {
    setEditorState(editorState);
  };

  const uploadImageCallBack = async (file: any) => {
    let loc_uploadedImages = uploadedImages;

    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    }

    loc_uploadedImages.push(imageObject);
    setUploadedImages(loc_uploadedImages)

    return new Promise(
      (resolve, reject) => getBase64Image(
        imageObject.localSrc,
        (data: any) => resolve({ data: { link: data } })
      )
    )
  }

  const getBase64Image = (url: any, callback: any) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx: any = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      callback(dataURL)
    }
    img.src = url
  }


  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/getBlogFilterLists");
        setTagsFromServer(response.data.tags);
        setCategoryFromServer(response.data.categories);
      } catch (error) {
        setTagsFromServer([]);
        setCategoryFromServer([]);
      }
      setLoading(false);
    }
    fetch()
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (route.includes("edit")) {
        setType("edit");
        var bID = route.replace("edit_", "")
        setId(bID);
        setLoading(true);
        try {
          const response = await axios.post("/api/getBlog", { id: bID });
          var result = response.data
          result.tags = response.data.tags.map((tag: any) => tag._id)
          result.category = response.data.category._id
          setBlogInfo(result);
          var setFormData = result
          const blocksFromHtml = htmlToDraft(result.content);
          if (blocksFromHtml) {
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
            setFormData.content = editorState
          }
          form.setFieldsValue(setFormData);
        } catch (error) {
          console.log("==============", error);
          setBlogInfo({});
        }
        setLoading(false);
      } else {
        setType("create");
        setId("");
      }
    }
    fetch()
  }, [form, route]);

  const addEditHandler = async () => {
    setLoading(true)
    let cont = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    blogInfo.content = cont
    const formData = new FormData();
    try {
      if (thumbnailFile) {
        var logo: any = await uploadFileHandler("blog", thumbnailFile);
        formData.append('imageSrc', logo)
      } else {
        formData.append('imageSrc', blogInfo.imageSrc ?? null)
      }

      formData.append('title', blogInfo.title)
      formData.append('paragraph', blogInfo.paragraph)
      formData.append('tags', blogInfo.tags)
      formData.append('category', blogInfo.category)
      formData.append('content', cont)
      formData.append('type', type)
      formData.append('id', id)

      const response = await fetch('/api/blogCreateEdit', {
        method: 'post',
        body: formData,
      });

      if (!response.ok) {
        console.log("falling over")
        setLoading(false);
        throw new Error(`response status: ${response.status}`);
      }

      await response.json();
      setTimeout(() => {
        setThumbnailFile(null);
        router.push('/blog');
      }, 500);

    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (prop: any) => (event: any) => {
    setBlogInfo({ ...blogInfo, [prop]: event.target.value });
  };

  const handleThumbnailChange = (e: any) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleTagsChange = (tag: any) => {
    setBlogInfo({ ...blogInfo, ['tags']: tag });
  }

  const handleCategoryChange = (category: any) => {
    setBlogInfo({ ...blogInfo, ['category']: category });
  }

  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <Spin tip="Loading..." spinning={loading}>
          <div className="col-12 blog-details">
            <Form
              form={form}
              layout="vertical"
              onFinish={addEditHandler}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                name="title"
                hasFeedback
                label={<span className="text-black dark:text-white">Blog Title</span>}
                rules={[{ required: true }, { type: 'string' }]}
              >
                <Input placeholder="Basic usage" value={blogInfo.title ? blogInfo.title : ""} onChange={handleChange('title')} type="text" />
              </Form.Item>
              <Form.Item
                name="paragraph"
                hasFeedback
                label={<span className="text-black dark:text-white">Paragraph</span>}
                rules={[{ required: true }]}
              >
                <Input.TextArea allowClear showCount value={blogInfo.paragraph ? blogInfo.paragraph : ""} onChange={handleChange('paragraph')} placeholder="Please input paragraph" />
              </Form.Item>
              <Form.Item
                name="thumbnail"
                hasFeedback
                label={<span className="text-black dark:text-white">Thumbnail</span>}
              >
                <label className="block text-sm font-medium text-black dark:text-white"></label>
                <input
                  id="thumbnail" name="thumbnail" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  onChange={(e) => handleThumbnailChange(e)}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                {thumbnailFile && <img className="rounded-lg w-[150px] h-[150px] object-contain p-2 bg-white" src={URL.createObjectURL(thumbnailFile)} alt={blogInfo?.route} />}
                {!thumbnailFile && blogInfo?.imageSrc != "null" && <img className="rounded-lg w-[150px] h-[150px] object-contain p-2 bg-white" src={blogInfo?.imageSrc} alt={blogInfo?.route} />}
              </Form.Item>
              <Form.Item
                name="category"
                hasFeedback
                label={<span className="text-black dark:text-white">Category</span>}
                rules={[{ required: true, message: 'Please select blog category!', type: 'string' }]}
              >
                <Select placeholder="Please select blog category" value={blogInfo.category} onChange={handleCategoryChange}>
                  {categoryFromServer.map((category: any) => (
                    <Option key={category._id} value={category._id}>{category.title}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="tags"
                hasFeedback
                label={<span className="text-black dark:text-white">Tags</span>}
                rules={[{ required: true, message: 'Please select blog tags!', type: 'array' }]}
              >
                <Select mode="multiple" placeholder="Please select blog tags" value={blogInfo.tags} onChange={handleTagsChange}>
                  {tagsFromServer.map((tag: any) => (
                    <Option key={tag._id} value={tag._id}>{tag.title}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="content"
                hasFeedback
                label={<span className="text-black dark:text-white">Blog Content</span>}
                rules={[{ required: true }]}
              >
                <Editor
                  wrapperClassName="wrapper-class"
                  editorClassName="editor rounded-sm border border-stroke px-4"
                  toolbarClassName="toolbar-class"
                  toolbar={{
                    blockType: { inDropdown: false },
                    link: { inDropdown: true },
                    history: { inDropdown: false },
                    image: {
                      uploadCallback: uploadImageCallBack,
                      previewImage: true,
                      alt: { present: true, mandatory: false },
                      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                    },

                  }}
                  editorState={editorState}
                  onEditorStateChange={onEditorStateChange}
                />
              </Form.Item>
              <Form.Item>
                <div className='flex justify-end'>
                  <Button type="primary" htmlType="submit" className="bg-[#1c2434] text-white">Submit</Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </div>
    </div>
  );
}

export default CreateBlog;
