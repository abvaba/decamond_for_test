'use client';
import {Button} from "@/components/ui/button";
import {useAuth} from "@/contexts/index";
import {useRouter} from "next/navigation";
import React, {useState, JSX, useEffect} from "react";
import _ from '@/app/dashboard/dashboard.module.css';
import Image from 'next/image'

type UserData = {
  results: {
    gender: string;
    name: {
      title: string;
      first: string;
      last: string;
    };
    location: {
      street: {
        number: number;
        name: string;
      };
      city: string;
      state: string;
      country: string;
      postcode: number;
      coordinates: {
        latitude: string;
        longitude: string;
      };
      timezone: {
        offset: string;
        description: string;
      };
    };
    email: string;
    login: {
      uuid: string;
      username: string;
      password: string;
      salt: string;
      md5: string;
      sha1: string;
      sha256: string;
    };
    dob: {
      date: string;
      age: number;
    };
    registered: {
      date: string;
      age: number;
    };
    phone: string;
    cell: string;
    id: {
      name: string;
      value: string;
    };
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
    nat: string;
  }[];
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
};

const Page: React.FC = (): JSX.Element => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { logout } = useAuth();


  useEffect(() => {
    // This code runs only on the client side
    try {
      const storedData = localStorage.getItem('user')
      if (storedData) {
        const parsedData: UserData = JSON.parse(storedData)
        setUserData(parsedData)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  const {
    results: [
      {
        picture: {
          large
        } = { large: '' },
        email,
        gender,
        name: {
          title,
          first,
          last
        } = {title: '', first: '', last: ''}
      } = {}
    ] = []
  } = userData || {};

  const logOut = () => {
    logout();
  }
  if (isLoading) {
    return <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
  }

  // if (!userData) {
  //   return <h1 className="text-2xl font-bold text-gray-600">No user data found</h1>
  // }
  return (
    <div className={_.wrapper} role="main" aria-labelledby="dashboard-heading">
      <header className={_.dashboardHeader}>
        <h1 id="dashboard-heading" className="text-2xl font-bold">
          به داشبورد خوش آمدید!
        </h1>
        <Button
          variant="destructive"
          onClick={logOut}
          aria-label="خروج از حساب کاربری"
          className="focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          خروج
        </Button>
      </header>

      <main className={_.userInfoWrapper}>
        <Image
          src={large}
          alt={`عکس پروفایل ${title} ${first} ${last}`}
          width={75}
          height={75}
          className="rounded-xl"
          loading="lazy"
          decoding="async"
        />

        <section
          className={_.userInfo}
          aria-labelledby="user-info-heading"
        >
          <h2 id="user-info-heading" className="sr-only">
            اطلاعات کاربری
          </h2>

          <div
            className="flex items-center"
            aria-label={`جنسیت: ${gender === 'male' ? 'مرد' : 'زن'}`}
          >
        <span aria-hidden="true">
          {gender === 'male' ? '🧑' : '👩'}
        </span>
            <span className="sr-only">
          {gender === 'male' ? 'مرد' : 'زن'}
        </span>
            <span aria-hidden="true">&nbsp;</span>
            <span>
          {title}
              <span aria-hidden="true">&nbsp;</span>
              {first}
              <span aria-hidden="true">&nbsp;</span>
              {last}
        </span>
          </div>

          <div
            className="flex items-center"
            aria-label={`ایمیل: ${email}`}
          >
            <span aria-hidden="true">✉️</span>
            <span className="sr-only">ایمیل</span>
            <span aria-hidden="true">&nbsp;</span>
            <a
              href={`mailto:${email}`}
              aria-label={`ارسال ایمیل به ${email}`}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {email}
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Page;
