/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation'
import { Form, message, Button, Input, Select, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { uploadFileHandler } from '@/utils/firebaseQuery';
import { openNotificationWithIcon } from '@/utils/notification'

const { Option } = Select;

const EditFund = ({ route }: any) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [areasFromServer, setAreasFromServer] = useState<any>([]);
  const [stagesFromServer, setStagesFromServer] = useState<any>([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [vcInfo, setVcInfo] = useState<any>({});


  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/getFilterLists");
        setAreasFromServer(response.data.areas);
        setStagesFromServer(response.data.stages);
      } catch (error) {
        setAreasFromServer([]);
        setStagesFromServer([]);
        openNotificationWithIcon('error', "Stage and Area", `Get data from area and stage failed`)
      }
      setLoading(false);
    }
    fetch()
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const response = await axios.post("/api/getFunds", { route: `/funds/${route}/` });
        var result = response.data;
        result.areas = response.data.areas.map((area: any) => area._id)
        result.stages = response.data.stages.map((stage: any) => stage._id)
        setVcInfo(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        setVcInfo({});
        openNotificationWithIcon('error', "Fund", `Get fund data failed`)
      }
      setLoading(false)

    }
    fetch()
  }, [form, route]);

  const addEditHandler = async (values: any) => {
    setLoading(true)
    const formData = new FormData();
    try {
      if (thumbnailFile) {
        var logo: any = await uploadFileHandler("fund", thumbnailFile);
        formData.append('logo', logo)
      } else {
        formData.append('logo', vcInfo.logo)
      }

      formData.append('title', vcInfo.title)
      formData.append('websites', values.websites)
      formData.append('location', vcInfo.location)
      formData.append('areas', vcInfo.areas)
      formData.append('stages', vcInfo.stages)
      formData.append('summary', vcInfo.summary)
      formData.append('type', "edit")
      formData.append('id', vcInfo._id)

      const response = await fetch('/api/fundCreateEdit', {
        method: 'post',
        body: formData,
      });

      if (!response.ok) {
        console.log("falling over")
        openNotificationWithIcon('error', "Fund", `Update failed`)
        setLoading(false);
        throw new Error(`response status: ${response.status}`);
      }

      await response.json();
      setTimeout(() => {
        openNotificationWithIcon('success', "Fund", `It has been successfully updated.`)
        setThumbnailFile(null);
        router.push('/venturecapital/vc');
      }, 500);
      
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', "Fund", `Update failed`)
    }
  }

  const handleChange = (prop: any) => (event: any) => {
    setVcInfo({ ...vcInfo, [prop]: event.target.value });
  };

  const handleThumbnailChange = (e: any) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleAreasChange = (area: any) => {
    setVcInfo({ ...vcInfo, ['areas']: area });
  }

  const handleStagesChange = (stage: any) => {
    setVcInfo({ ...vcInfo, ['stages']: stage });
  }

  const handleCategoryChange = (category: any) => {
    setVcInfo({ ...vcInfo, ['category']: category });
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
                label={<span className="text-black dark:text-white">Title</span>}
                rules={[{ required: true }, { type: 'string' }]}
              >
                <Input value={vcInfo.title ? vcInfo.title : ""} onChange={handleChange('title')} type="text" />
              </Form.Item>

              <span className="flex mb-2 text-black dark:text-white">Websites</span>
              <Form.List name="websites">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ display: 'flex', marginBottom: 8 }}>
                        <Form.Item {...restField} name={name} rules={[{ required: true }]} style={{ width: "100%" }}>
                          <Input placeholder="Please input website url" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} style={{ marginBottom: "24px", marginLeft: "10px" }} />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type="dashed" className="text-black dark:text-white" onClick={() => add()} block icon={<PlusOutlined />}>Add More</Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              <Form.Item
                name="location"
                hasFeedback
                label={<span className="text-black dark:text-white">Location</span>}
              >
                <Input value={vcInfo.location ? vcInfo.location : ""} onChange={handleChange('location')} type="text" />
              </Form.Item>
              <Form.Item
                name="logo"
                hasFeedback
                label={<span className="text-black dark:text-white">Logo</span>}
              >
                <label className="block text-sm font-medium text-black dark:text-white"></label>
                <input
                  id="logo" name="logo" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
                  onChange={(e) => handleThumbnailChange(e)}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
                {thumbnailFile && <img className="rounded-lg w-[150px] h-[150px] object-contain p-2 bg-white mt-2" src={URL.createObjectURL(thumbnailFile)} alt={vcInfo?.route} />}
                {!thumbnailFile && vcInfo?.logo && <img className="rounded-lg w-[150px] h-[150px] object-contain p-2 bg-white mt-2" src={vcInfo?.logo} alt={vcInfo?.route} />}
              </Form.Item>

              <Form.Item
                name="stages"
                hasFeedback
                label={<span className="text-black dark:text-white">Investment Stages</span>}
              >
                <Select mode="multiple" placeholder="Please select stages" value={vcInfo.stages} onChange={handleStagesChange}>
                  {stagesFromServer.map((stage: any) => (
                    <Option key={stage._id} value={stage._id}>{stage.title}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="areas"
                hasFeedback
                label={<span className="text-black dark:text-white">Investment Areas</span>}
              >
                <Select mode="multiple" placeholder="Please select areas" value={vcInfo.areas} onChange={handleAreasChange}>
                  {areasFromServer.map((area: any) => (
                    <Option key={area._id} value={area._id}>{area.title}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="summary"
                hasFeedback
                label={<span className="text-black dark:text-white">Summary</span>}
              >
                <Input.TextArea allowClear showCount value={vcInfo.summary ? vcInfo.summary : ""} onChange={handleChange('summary')} placeholder="Please input summary" />
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

export default EditFund;
