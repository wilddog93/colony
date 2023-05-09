import Head from 'next/head';
import Cards from '../components/Cards/Cards';
import {
  useAppDispatch,
  useAppSelector,
} from '../redux/Hook';
import {
  decrement,
  increment,
  incrementByAmount,
  selectCount,
} from '../redux/features/counter/counterSlice';
import { useEffect, useState } from 'react';
import { getKanyeQuote, selectKanye } from '../redux/features/kanye/kanyeReducer';
import { AppProps } from 'next/app';
import { GetServerSideProps } from 'next';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Button from '../components/Button/Button';
import { selectAuth } from '../redux/features/auth/authReducers';
import DefaultLayout from '../components/Layouts/DefaultLayouts';
import { MdArrowRightAlt } from 'react-icons/md';

type Props = {
  pageProps: any
}

const Home = ({ pageProps }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const auth = useAppSelector(selectAuth);

  // sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DefaultLayout
      title="Colony"
      header="Home"
      head=""
      logo="image/logo/logo-icon.svg"
      description=""
      images="image/logo/building-logo.svg"
      userDefault="image/user/user-01.png"
    >
      <div className='absolute inset-0 mt-20 z-99 bg-boxdark flex text-white'>
        <div className="relative w-full bg-white p-8 pt-0 2xl:p-10 2xl:pt-0 overflow-y-auto">
          <div className='sticky bg-white top-0 z-50 w-full flex flex-col lg:flex-row items-start lg:items-center justify-between py-6 mb-3 gap-2'>
            <div className='w-full flex items-center justify-between py-3'>
              <h3 className='w-full lg:max-w-max text-center text-2xl font-semibold text-graydark'>Home</h3>
            </div>
          </div>

          <main className='relative tracking-wide text-left text-boxdark-2'>
            <div className="w-full flex flex-1 flex-col overflow-auto gap-2.5 lg:gap-6">
              {/* content */}
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid architecto commodi nulla, totam saepe facere doloribus harum mollitia recusandae minima iusto quas distinctio excepturi quidem eos id vel sed esse vitae numquam. Excepturi adipisci magnam quo fugiat, soluta, commodi obcaecati id vel asperiores labore accusamus assumenda. Beatae laboriosam cum voluptas eos nihil architecto iure earum sit dolorum aperiam neque, rerum mollitia est quam? Beatae sed quae eum natus, commodi maiores adipisci odit possimus ipsam obcaecati placeat debitis cum ab architecto minima dolorum tempore id quis recusandae. Ea et nihil officia quos culpa inventore aliquam incidunt placeat ex ad repellendus dolorum deserunt, libero est corporis? Rem error quibusdam harum sint recusandae aut sed autem repellat voluptatibus doloribus ipsa voluptate voluptates rerum voluptas cum minima nemo cupiditate neque ratione vitae esse optio, iusto corrupti? Voluptate optio saepe labore ratione expedita quaerat enim laboriosam est. Magni, minima. Illo aut deserunt quidem inventore voluptate vero explicabo sunt repellendus magnam velit voluptatibus a, aspernatur vitae, nesciunt autem id deleniti sequi, cupiditate sapiente! Sit, sequi minus eos, sint vel quas ab eligendi nam rerum nihil labore earum blanditiis architecto dolore error facilis nostrum, porro eius. A molestias eos consequatur. Facilis eum, nemo optio a quo sint ipsam fugit, rerum vero eius ab, illum accusantium impedit consequuntur id veniam enim? Magnam amet eum repellendus vitae deserunt sunt nihil id consequatur harum fugiat maiores corporis, repellat obcaecati, possimus sit aliquam voluptatum itaque odio dolor fuga commodi delectus blanditiis inventore. Inventore earum ad temporibus dolores illo veritatis numquam quibusdam delectus labore exercitationem, aliquid, rerum tempore voluptate nisi laborum iure quisquam non unde deserunt dolor magni, asperiores aut necessitatibus. Quia, necessitatibus natus. Unde, iure! Ex iste, molestias facere et dolorum cum cupiditate sapiente nisi quae fugit. Suscipit iure facilis minima nesciunt soluta modi. Aliquam nostrum, esse labore tempore hic voluptatum dolorum dolorem ab voluptatem officia expedita voluptates dignissimos veniam ad similique sapiente nulla rerum fuga commodi distinctio? Expedita reiciendis quidem sequi. Illum ullam atque exercitationem, autem repellendus consectetur saepe temporibus praesentium numquam officiis voluptatem mollitia eligendi optio labore consequatur animi itaque hic id a dicta dolor quisquam maiores! Fugiat atque, corrupti odit impedit accusantium dicta explicabo dolorem dolore voluptatibus. Nihil, omnis eveniet rem veniam voluptate consequatur commodi enim mollitia, labore incidunt ut facilis ipsum sed velit eum iusto odio laudantium! At corporis necessitatibus fugit, tempore sit sunt dolorem provident rerum nesciunt velit mollitia nihil tenetur deserunt totam enim commodi, vero qui soluta dolor atque nulla nemo eaque! Nemo et perspiciatis iusto inventore at aliquam quos perferendis possimus ab exercitationem? Perspiciatis veritatis nisi praesentium? Quisquam officiis porro culpa cupiditate delectus quis, dicta voluptates illum. Debitis, iste. Accusantium recusandae ab explicabo repellat non quasi pariatur delectus quae eius, suscipit velit minima, possimus ex rerum magni sint quidem corrupti! Repudiandae eos repellat saepe porro asperiores, temporibus deleniti rem distinctio voluptatem quisquam tempore non corrupti, vitae eveniet, quae optio minima at. Voluptate error distinctio, totam quidem maiores doloribus, fugiat saepe dignissimos alias possimus consequatur iste at corrupti ea asperiores assumenda corporis harum deserunt voluptas sunt nesciunt quis optio velit? Tempora, id vitae ut odit, perferendis magni error animi dolore amet illo sapiente debitis quam doloribus provident esse. Qui reprehenderit assumenda molestiae accusamus facere explicabo alias quae eveniet, voluptatem laborum officia tempore totam eligendi? Cupiditate dolorum, ipsa modi, illo odio tempora delectus veritatis earum hic placeat iusto quae, ex quas velit incidunt cum repellendus nobis excepturi. Soluta nisi molestiae nobis. Modi minima blanditiis fugit ullam alias deleniti accusamus eius, exercitationem nihil consequuntur atque eos animi voluptatum quisquam laboriosam dolorem adipisci. Tenetur pariatur earum architecto impedit enim! Molestias nisi vitae est, aliquam accusantium dicta? Repellendus mollitia corrupti fugiat dicta excepturi magnam quaerat sunt. Qui repellat alias obcaecati accusantium non. Asperiores magnam voluptates iure facere ab perspiciatis dolorem consectetur dignissimos, nostrum quas deserunt laudantium nemo temporibus atque eveniet vitae repudiandae dolore quam numquam libero velit. Alias ex ratione tempore ab magni perspiciatis cupiditate vero quod fugit dolores ut officiis, quam nobis eaque quo rem quis, adipisci molestiae? Corrupti eius placeat nulla sunt aliquam, expedita amet dolor possimus a dolorum fuga iure in deleniti beatae iusto! Suscipit ipsa veniam, natus ipsam doloremque quisquam totam eum cumque maxime et fuga optio recusandae nostrum distinctio qui non cum alias repellat quo blanditiis. Porro dignissimos repudiandae vero eligendi aliquam id maiores quia tempore. Laboriosam iusto ipsum nisi qui! Molestias odio necessitatibus ratione est sunt earum vel aliquam quisquam iure laboriosam ea modi, fugiat sed dolorum optio cumque neque tenetur dolores consequuntur. Ut, corporis facere! Unde quis corporis totam eveniet cum ex expedita explicabo ipsa, non neque illum aspernatur laborum laudantium vel et eaque dolores, quod inventore. At, repudiandae repellat similique error ipsum ratione odio assumenda quis ducimus consequatur adipisci aut! Officiis vitae neque modi nam? Fugit alias, aspernatur voluptas doloribus nihil qui. Repellendus tempora asperiores ad, harum molestiae ratione atque, laudantium vero animi velit vel voluptatibus in ab. Molestias accusantium commodi cum corporis nihil! Reiciendis alias modi numquam nesciunt id quaerat iste labore laudantium hic suscipit, quas recusandae, aperiam iure. Explicabo est quod quasi nihil veritatis molestias, non dolores, ea ullam unde quam voluptas? Vel laudantium, inventore animi autem, unde mollitia a architecto nihil ipsa optio at, accusantium quis? Inventore dolorum quia modi illum saepe laboriosam, magni, totam asperiores assumenda quas voluptate in, cum deleniti optio sapiente officiis error mollitia soluta delectus tempore odit earum! Ad qui error et doloribus similique facere, reprehenderit autem assumenda laudantium architecto fugit minus alias iure ipsam? Atque reprehenderit vel, accusamus reiciendis corrupti molestias quaerat libero eveniet aliquam facere consectetur harum nemo? Adipisci, ex quo. A nam iusto totam quaerat, illo voluptas corporis deleniti ducimus! Similique explicabo animi, eius praesentium at aut aspernatur porro itaque exercitationem quae cum ut esse sapiente! Quia harum inventore, doloremque nobis ratione vel eaque! Assumenda, iusto iure ipsam numquam esse, nulla blanditiis alias repellat at corporis perspiciatis molestiae dicta. Eligendi veniam, soluta, commodi delectus optio aliquid iure odio nemo nam cum mollitia eveniet enim ratione explicabo? Voluptates consectetur dolor fugiat doloribus nam earum iure, velit, voluptas aut, nemo debitis obcaecati sed.
            </div>
          </main>
        </div>
      </div>
    </DefaultLayout>
  )
}

export const getServerSideProps:GetServerSideProps = async (context: any) => {
  const token = await getCookie("accessToken", context)

  if(token){
    return {
      props: {
        token
      },
    };
  }
  
  return {
    props: {},
  }
}

export default Home;
