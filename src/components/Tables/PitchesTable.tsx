"use client";
import Image from "next/image";
import { Pagination, Tag } from 'antd';

interface IProps {
  data: { infos: [], dataLength: number };
  perPage: any,
  currentPage: any,
  setCurrentPage: any
}

const PitchesTable = ({ data, perPage, currentPage, setCurrentPage }: IProps) => {
  const handlePageChange = (page: any, pageNumber: any) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full flex justify-between">
          <div className="flex items-center text-black dark:text-white">
            Totoal items: {data.dataLength}
          </div>
        </div>
        <table className="w-full table-auto mt-4">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">VC Info</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Websites</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Startup Info</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Investment Area</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Investment Stage</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Pitch Deck URL</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.infos?.map((item: any) => (
              <tr key={item._id} className="border-b border-[#eee] px-4 py-4 dark:border-strokedark h-[60px]" >
                <td >
                  {item.fund.logo &&
                    <Image className="object-contain rounded-lg shadow-default" src={item.fund?.logo} alt="Logo" width={60} height={60} />
                  }
                  <h5 className="font-medium text-black dark:text-white">{item.fund.title}</h5>
                </td>
                <td >
                  {item?.fund.websites?.map((site: any, index: any) => (
                    <a href={site} target="_blank" key={index} className="mb-2 text-sm text-[#549dd2]">
                      <Tag color="orange" className="mb-1">{site}</Tag>
                    </a>
                  ))}
                </td>
                <td >
                  {item.startup.logo &&
                    <Image className="object-contain rounded-lg shadow-default" src={item.startup?.logo} alt="Logo" width={60} height={60} />
                  }
                  <h5 className="font-medium text-black dark:text-white">{item.startup.name}</h5>
                </td>
                <td >
                  {item.startup.areasList?.map((area: any) => (
                    <Tag key={area._id} color="magenta" className="mb-1">{area?.title}</Tag>
                  ))}
                </td>
                <td >
                  {item.startup.stageList?.map((stage: any) => (
                    <Tag key={stage._id} color="geekblue" className="mb-1">{stage?.title}</Tag>
                  ))}
                </td>
                <td>
                  <a href={item.startup.deckURL} target="_blank" className="mb-2 text-sm text-[#549dd2]">
                    <Tag color="orange" className="mb-1">{item.startup.deckURL}</Tag>
                  </a>
                </td>
                <td>
                  <p className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${item.isActive ? "bg-success text-success" : "bg-danger text-danger"}`}>
                    {item.isActive ? "Active" : "Inactive"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          className="py-4 text-center"
          total={data.dataLength}
          pageSize={perPage}
          current={currentPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default PitchesTable;
