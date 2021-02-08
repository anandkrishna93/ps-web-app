import React, { useState, useEffect } from 'react';
import axios from 'axios';
const qs = require('qs');
const yearList = ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
const IN_PROGRESS = 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==';

function WorkflowRepository(props) {
  const [dataList, setDataList] = useState([]);
  const [selectedLaunch, setSelectedLaunch] = useState(true);
  const [selectedLand, setSelectedLand] = useState(true);
  const [selectedYear, setSelectedYear] = useState('');
  const [spinnerFlag, setSpinnerFlag] = useState(true);

  const getList = async (launchS, landS, launchY) => {
    const parameter = {
      launch_success: launchS,
      land_success: landS,
      launch_year: launchY
    }

    try {
      const response = await axios.get(`https://api.spacexdata.com/v3/launches?limit=100&${qs.stringify(parameter)}`);
      setDataList(response.data);
      setSpinnerFlag(false);
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    getList(true, true);
  }, []);

  const fliterYear = (ftype, id) => {
    setSpinnerFlag(true);
    if (ftype === 'launch') {
      if (id !== selectedLand) {
        setSelectedLaunch(id)
        getList(id, selectedLand, selectedYear);
      }
    } else if (ftype === 'land') {
      if (id !== selectedLaunch) {
        setSelectedLand(id);
        getList(selectedLaunch, id, selectedYear);
      }
    } else if (ftype === 'year') {
      const sYear = id !== selectedYear ? id : undefined;
      setSelectedYear(sYear)
      getList(selectedLaunch, selectedLand, sYear);
    }
  }

  return (
    <React.Fragment>
      <div className="row-style">
        {
          spinnerFlag ? <div className="spinner">
            <img src={IN_PROGRESS} alt="spinner" />
          </div> : null
        }

        <div className="filter-container">
          <div className="fBox">
            <h5>Launch year</h5>
            {
              yearList.map(id =>
                <div key={id}>
                  <a
                    className={['ly-btn', selectedYear == id ? 'active' : ''].join(' ')}
                    onClick={(e) => fliterYear('year', id)}>
                    {id}
                  </a>
                </div>)
            }

            <h5>Launch success</h5>
            <div>
              <a className={['ly-btn', selectedLaunch ? 'active' : ''].join(' ')} onClick={(id) => fliterYear('launch', true)}>True</a>
            </div>
            <div>
              <a className={['ly-btn', selectedLaunch ? '' : 'active'].join(' ')} onClick={(id) => fliterYear('launch', false)}>False</a>
            </div>

            <h5>Land success</h5>
            <div>
              <a className={['ly-btn', selectedLand ? 'active' : ''].join(' ')} onClick={(id) => fliterYear('land', true)}>True</a>
            </div>
            <div>
              <a className={['ly-btn', selectedLand ? '' : 'active'].join(' ')} onClick={(id) => fliterYear('land', false)}>False</a>
            </div>
          </div>
        </div>

        <div className="main-container">
          {
            dataList && dataList.length ? dataList.map((id, index) =>
              <div className="detailBox" key={id.flight_number}>
                <div key={id.flight_number}>
                  <img src={id.links.mission_patch_small} alt={id.mission_name} />

                  <h4>{id.mission_name} #{id.flight_number}</h4>

                  <div>
                    <b>Mission Ids</b>: {id.mission_id ? JSON.stringify(id.mission_id) : id.mission_id}
                  </div>

                  <div>
                    <b>Launch Year</b>: {id.launch_year}
                  </div>

                  <div>
                    <b>Successful Launch</b>: {id.launch_success ? 'true' : 'false'}
                  </div>

                  <div>
                    <b>Successful Landing</b>: {id.land_success ? 'true' : 'false'}
                  </div>
                </div>
              </div>
            ) : <h3>No data found !!</h3>
          }
        </div>
      </div>
    </React.Fragment>
  );
}

export default WorkflowRepository;