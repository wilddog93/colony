import React, { useEffect, useState } from 'react'
import DomainLayouts from '../../../components/Layouts/DomainLayouts'
import { MdEdit, MdMuseum, MdSettings } from 'react-icons/md';
import Button from '../../../components/Button/Button';
import Cards from '../../../components/Cards/Cards';
import Barcharts from '../../../components/Chart/Barcharts';
import Doughnutcharts from '../../../components/Chart/Doughnutcharts';
import { getCookies } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook';
import { getAuthMe, selectAuth } from '../../../redux/features/auth/authReducers';
import { useRouter } from 'next/router';
import PieCharts from '../../../components/Chart/Piecharts';
import { selectDomainProperty } from '../../../redux/features/domain/domainProperty';
import { getDomainId, selectAccessDomain } from '../../../redux/features/accessDomain/accessDomainReducers';

type Props = {
  pageProps: any
}

const DomainHome = ({ pageProps }: Props) => {
  const url = process.env.API_ENDPOINT;
  const router = useRouter();
  const { pathname, query } = router;
  const { token, access, accessId, firebaseToken } = pageProps;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // redux
  const dispatch = useAppDispatch();
  const { data } = useAppSelector(selectAuth);
  const { domain } = useAppSelector(selectAccessDomain);
  const { properties, pending, error } = useAppSelector(selectDomainProperty);

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

  let bardataHour = {
    labels: ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"],
    datasets: [
      {
        label: "Outstanding",
        borderRadius: 0,
        data: [100, 250, 50, 30, 15, 3, 90],
        backgroundColor: "#5F59F7",
        barThickness: 20,
      },
      {
        label: "Running",
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
        text: 'Unit per apartment',
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

  let barOptionsHour = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        align: "start",
        text: 'Total Income (Million IDR)',
        font: {
          weight: "300",
          size: "16px"
        }
      },
      tooltip: {
        titleFont: {
          size: 20
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
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: false,
          min: 0,
          max: 10,
        },
      },
    },
    elements: {
      bar: {
        percentage: 0.1,
        categoryPercentage: 1,
      },
    },
  };

  useEffect(() => {
    if (token) {
      dispatch(getAuthMe({ token, callback: () => router.push("/authentication?page=sign-in") }))
    }
  }, [token]);

  const goToManage = () => {
    router.push({ pathname: "/owner/home/general-information" })
  };

  useEffect(() => {
    if (accessId) {
      dispatch(getDomainId({ id: accessId, token }))
    }
  }, [accessId])

  console.log(domain, "data domain")

  return (
    <DomainLayouts
      title="Colony"
      header="Owner"
      head="Home"
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
          <div className='bg-[#1C2D3D] top-0 z-40 w-full py-8 px-6 gap-2 h-[170px]'>
            <div className="w-full flex gap-2 items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={domain?.domainLogo ? `${url}domain/domainLogo/${domain?.domainLogo}` : "../image/logo/logo-icon.svg"} alt="logo" className='w-18 h-18 object-cover object-center bg-white p-1 rounded-full' />
                <div>
                  <h3 className='text-lg lg:text-title-lg font-semibold'>{domain?.domainName}</h3>
                  <p className='text-sm lg:text-base'>Manage your property</p>
                </div>
              </div>

              <div className='flex'>
                <Button
                  type="button"
                  variant="primary"
                  className="rounded-lg"
                  onClick={goToManage}
                >
                  <span>Manage Domain</span>
                  <MdSettings className='w-5 h-5' />
                </Button>
              </div>
            </div>

          </div>

          <div className='w-full relative -mt-16 tracking-wide text-left text-boxdark-2 py-6 px-8 2xl:px-10'>
            <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6">
              <div className="w-full grid col-span-1 lg:grid-cols-3 gap-4 tracking-wider mb-5">
                <Cards className='w-full lg:col-span-2 bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                  <div className='w-full grid grid-cols-4 border-b-2 border-gray p-4'>
                      <div className="w-full">
                        <h3>Total Property</h3>
                        <p className='font-semibold'>32</p>
                      </div>

                      <div className="w-full">
                        <h3>Total Unit</h3>
                        <p className='font-semibold'>3225</p>
                      </div>

                      <div className="w-full">
                        <h3>Total Tenant</h3>
                        <p className='font-semibold'>2412</p>
                      </div>

                      <div className="w-full">
                        <h3>Total Issues</h3>
                        <p className='font-semibold'>332</p>
                      </div>
                  </div>
                  <Barcharts data={bardataHour} options={barOptionsHour} className='w-full max-w-max' height='200px' />
                </Cards>
                <div className='w-full flex flex-col gap-4'>
                  <Cards className='w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                    <PieCharts data={doughnutData} options={doughnutOptions} className='w-full max-w-max' height='300px' />
                  </Cards>
                  <Cards className='w-full bg-white shadow-md text-gray-6 font-thin text-sm sm:text-base rounded-xl border border-gray p-4'>
                    <PieCharts data={doughnutData} options={doughnutOptions} className='w-full max-w-max' height='300px' />
                  </Cards>
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
  const accessId = cookies['accessId'] || null;
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
    props: { token, access, accessId, firebaseToken },
  };
};

export default DomainHome;