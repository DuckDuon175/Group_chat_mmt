import React, { useState, useEffect } from "react";
import SingleCard from '../components/SingleCard';
// import MileChart from '../components/MileChart';

import { RiUser2Line, RiUserHeartLine, RiNewspaperLine, RiRecordCircleLine } from 'react-icons/ri';

const dashboardStyles = {
  marginTop: "20px",
  padding: "0px 30px",
  paddingBottom: "50px",
  width: "100%",
  boxSizing: "border-box",
};

const dashboardCardsStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  columnGap: "2rem",
};

const statsStyles = {
  background: "#f2f2f2",
  padding: "30px",
  borderRadius: "5px",
  height: "320px",
  paddingBottom: "50px",
 
};

const statsTitleStyles = {
  color: "#1C2833",
  fontSize: "1.2rem",
  fontWeight: "500",
  marginBottom: "20px",
};

const staticsStyles = {
  display: "grid",
  columnGap: "2rem",
  marginTop: "2rem",
};


const Dashboard = () => {

  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);
  const [ecgCount, setEcgCount] = useState(0);

  useEffect(() => {
    fetch('/dashboard-data')
      .then(response => response.json())
      .then(data => {
        setDoctorCount(data.doctorCount);
        setPatientCount(data.patientCount);
        setNewsCount(data.newsCount);
        setEcgCount(data.ecgCount);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
      });
  }, []);

  const doctorObj = {
    title: "Total Doctors",
    totalNumber: doctorCount,
    icon: <RiUser2Line />,
    link: "resources/Doctor"
  };
  
  const patientObj = {
    title: "Total Patients",
    totalNumber: patientCount,
    icon: <RiUserHeartLine />,
    link: "resources/Patient"
  };
  
  const newsObj = {
    title: "Total News",
    totalNumber: newsCount,
    icon: <RiNewspaperLine />,
    link: "resources/news"
  };

  const ecgObj = {
    title: "Total ECG Records",
    totalNumber: ecgCount,
    icon: <RiRecordCircleLine />,
    link: "resources/ecg_records"
  };


    const [mileStaticsDataWeek, setWeekData] = useState([]);
    const [mileStaticsDataMonth, setMonthData] = useState([]);
  
    useEffect(() => {
      fetch('/dashboard-miles-stat-data/week')
        .then(response => response.json())
        .then(data => {
          setWeekData(data);
        })
        .catch(error => {
          console.error('Error fetching weekly dashboard data:', error);
        });
  
      fetch('/dashboard-miles-stat-data/month')
        .then(response => response.json())
        .then(data => {
          setMonthData(data);
        })
        .catch(error => {
          console.error('Error fetching monthly dashboard data:', error);
        });
    }, []);

    
  return (
    <div style={dashboardStyles} className="dashboard">
      <div className="dashboard__wrapper">
        <div style={dashboardCardsStyles} className="dashboard__cards">
          <SingleCard item={doctorObj} />
          <SingleCard item={patientObj} />
          <SingleCard item={newsObj} />
          <SingleCard item={ecgObj} />
        </div>

      {/* <div style={staticsStyles} className="statics">
        <div style={statsStyles} className="stats">
          <h3 style={statsTitleStyles} className="stats__title">User Statistics</h3>
          <MileChart mileStaticsDataWeek={mileStaticsDataWeek} mileStaticsDataMonth={mileStaticsDataMonth}/>
        </div>

      </div> */}

      </div>
    </div>
  );
};

export default Dashboard;
