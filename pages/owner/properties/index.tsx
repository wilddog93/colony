import React, { useEffect, useState } from 'react'
import DomainLayouts from '../../../components/Layouts/DomainLayouts'
import { MdEdit, MdMuseum } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import Cards from '../../../components/Cards/Cards';
import Barcharts from '../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import SidebarBody from '../../../components/Layouts/Sidebar/SidebarBody';

type Props = {
  pageProps: any
}

const DomainProperty = ({ pageProps }: Props) => {
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);

  // state
  const [doghnutData, setDoghnutData] = useState([]);
  const [doghnutLabel, setDoghnutLabel] = useState([]);

  let doughnutData = {
    labels: ['Guest', 'Available', 'Tenants'],
    datasets: [
      {
        label: '# Votes',
        data: [20, 100, 500],
        backgroundColor: [
          '#44C2FD',
          '#FAEE81',
          '#5F59F7',
        ],
        borderColor: [
          '#44C2FD',
          '#FAEE81',
          '#5F59F7',
        ],
        borderWidth: 1,
      },
    ]
  };

  let bardata = {
    labels: ["B1", "B2", "G"],
    datasets: [
      {
        label: "Single",
        borderRadius: 0,
        data: [100, 250, 50],
        backgroundColor: "#5F59F7",
        barThickness: 20,
      },
      {
        label: "Tandem",
        borderRadius: 0,
        data: [100, 90, 50],
        backgroundColor: "#FF8859",
        barThickness: 20,
      },
      {
        label: "Guest",
        borderRadius: 0,
        data: [100, 10, 50],
        backgroundColor: "#44C2FD",
        barThickness: 20,
      },
    ],
  };

  let bardataMonths = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Months",
        borderRadius: 0,
        data: [100, 250, 50, 30, 15, 3, 90, 200, 145, 32, 55, 89],
        backgroundColor: "#5F59F7",
        barThickness: 20,
      }
    ],
  };

  let bardataHour = {
    labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
    datasets: [
      {
        label: "In",
        borderRadius: 0,
        data: [100, 250, 50, 30, 15, 3, 90],
        backgroundColor: "#5F59F7",
        barThickness: 20,
      },
      {
        label: "Out",
        borderRadius: 0,
        data: [100, 90, 50, 69, 8, 78, 44],
        backgroundColor: "#FF8859",
        barThickness: 20,
      },
    ],
  };

  let doughnutOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        responsive: true,
        display: true,
        position: "right",
        align: "center",
        labels: {
          boxWidth: 20,
          font: {
            size: 16,
          },
          generateLabels: (chart: any) => {
            const { labels, datasets } = chart.data;
            if (labels.length > 0) {
              return labels.map((label: any, i: any) => {
                const { borderColor, backgroundColor, data } = datasets[0];
                const total = data.reduce((a: number, b: number) => a + b, 0);

                const formattedLabel = data.map((val: number, i: any) => {
                  let currentValue = val;
                  let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                  return {
                    value: currentValue,
                    label,
                    percentage,
                    backgroundColor: backgroundColor[i],
                    borderColor: borderColor[i]
                  };
                });

                return {
                  text: `${formattedLabel[i].label} - ${formattedLabel[i].percentage}%`,
                  fillStyle: formattedLabel[i].backgroundColor,
                  hidden: !chart.getDataVisibility(i),
                  index: i,
                };
              });
            }
            return [];
          }
        },
      },
      parsing: {
        key: 'id'
      },
      title: {
        display: true,
        position: "top",
        align: "start",
        text: 'Parking Lots',
        font: {
          size: 16,
          weight: 300
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true
      },
      tooltip: {
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 16
        },
        callbacks: {
          label: function (item: any) {
            let dataset = item.dataset;
            const total = dataset.data.reduce(function (sum: number, current: any) { return sum + Number(current) }, 0)
            let currentValue = item.parsed;
            let percentage = Math.floor(((currentValue / total) * 100) + 0.5);
            return `${item.label} : ${currentValue} ${currentValue > 1 ? "lots" : "lot"} - ${percentage}%`
          }
        }
      },
    }
  };

  let barOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 16
        }
      },
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        position: "top",
        align: "start",
        text: 'Total Lots by Type 2022',
        font: {
          size: 16,
          weight: 300
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.1,
        categoryPercentage: 0,
      },
    },
  };

  let barOptionsMonths = {
    responsive: true,
    plugins: {
      tooltip: {
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 16
        }
      },
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        position: "top",
        align: "start",
        text: 'Incoming Guest/Month 2022',
        font: {
          size: 16,
          weight: 300
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.1,
        categoryPercentage: 0,
      },
    },
  };

  let barOptionsHour = {
    responsive: true,
    plugins: {
      tooltip: {
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 16
        }
      },
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 15,
          usePointStyle: false,
          pointStyle: "circle",
        },
      },
      title: {
        display: true,
        position: "top",
        align: "start",
        text: 'Peak Hour on July 2022',
        font: {
          size: 16,
          weight: 300
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.1,
        categoryPercentage: 0,
      },
    },
  };

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Properties"
      logo="../image/logo/logo-icon.svg"
      description=""
      images="../image/logo/building-logo.svg"
      userDefault="../image/user/user-01.png"
      token={token}
      icons={{
        icon: MdMuseum,
        className: "w-8 h-8 text-meta-5"
      }}
    >
      <div className='w-full absolute inset-0 mt-16 z-99 bg-boxdark flex text-white'>
        <div className="relative w-full bg-gray overflow-y-auto">
          <div className="w-full flex mt-20">
            {/* <SidebarBody
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            >
              <div className='text-black'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita nemo earum quae, excepturi culpa quam repellat esse, perspiciatis corrupti in iure accusantium et vero labore officia qui quibusdam eveniet sit ad quo ipsum assumenda illum! Harum quo, deserunt repellat qui nemo iusto consequuntur quod debitis quia architecto nihil aperiam sapiente voluptatibus doloribus accusamus saepe incidunt itaque adipisci pariatur reiciendis explicabo alias! Iure magni reiciendis excepturi consequatur totam amet laudantium eligendi, nesciunt qui voluptas. Natus, nam at, rerum voluptatum ab praesentium laboriosam ullam numquam perferendis laborum corporis odio cum tempore? Ipsum nostrum officia ad laborum in, cupiditate nobis. Autem, facere iure!
              </div>
            </SidebarBody> */}

            <div className='w-full relative -mt-16 tracking-wide text-left text-boxdark-2 py-6 px-8 2xl:px-10'>
              <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6">
                <div className="w-full grid col-span-1 lg:grid-cols-3 gap-4 tracking-wider mb-5">
                  <Cards className='w-full lg:col-span-2 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                    <Barcharts data={bardataHour} options={barOptionsHour} className='w-full max-w-max' height='200px' />
                  </Cards>
                  <div className='w-full flex flex-col gap-4'>
                    <Cards className='w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                      <Doughnutcharts data={doughnutData} options={doughnutOptions} className='w-full max-w-max' height='300px' />
                    </Cards>
                    <Cards className='w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                      <Doughnutcharts data={doughnutData} options={doughnutOptions} className='w-full max-w-max' height='300px' />
                    </Cards>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DomainLayouts>
  )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse cookies from the request headers
  const cookies = getCookies(context)

  // Access cookies using the cookie name
  const token = cookies['accessToken'] || null;
  const access = cookies['access'] || null;
  const firebaseToken = cookies['firebaseToken'] || null;

  if (!token || access !== "owner") {
    return {
      redirect: {
        destination: "/authentication?page=sign-in", // Redirect to the home page
        permanent: false
      },
    };
  }

  return {
    props: { token, access, firebaseToken },
  };
};

export default DomainProperty;