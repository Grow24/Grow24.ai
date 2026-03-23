import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import PillButtons from './shared/PillButtons';
import DataTable from './shared/DataTable';
import OicaMap from './OicaMap';

const OicaModule = () => {
  const [vehicleCategory, setVehicleCategory] = useState('All Vehicles');
  const [countryData, setCountryData] = useState([]);
  const [continentData, setContinentData] = useState([]);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    const mockCountryData = [
      {
        id: 1,
        country: 'AUSTRIA',
        unitSales2007: 339691,
        unitSales2017: 403580,
        cagr2007_2017: 18.81,
        rank2007: 30,
        rank2017: 28,
        globalShare2007: 0.47,
        globalShare2017: 0.42,
      },
      {
        id: 2,
        country: 'BELGIUM',
        unitSales2007: 602365,
        unitSales2017: 634111,
        cagr2007_2017: 5.27,
        rank2007: 19,
        rank2017: 21,
        globalShare2007: 0.84,
        globalShare2017: 0.66,
      },
      {
        id: 3,
        country: 'DENMARK',
        unitSales2007: 226214,
        unitSales2017: 263361,
        cagr2007_2017: 16.42,
        rank2007: 39,
        rank2017: 37,
        globalShare2007: 0.32,
        globalShare2017: 0.27,
      },
      {
        id: 4,
        country: 'FINLAND',
        unitSales2007: 147842,
        unitSales2017: 138375,
        cagr2007_2017: -6.40,
        rank2007: 48,
        rank2017: 49,
        globalShare2007: 0.21,
        globalShare2017: 0.14,
      },
      {
        id: 5,
        country: 'FRANCE',
        unitSales2007: 2629186,
        unitSales2017: 2604942,
        cagr2007_2017: -0.92,
        rank2007: 8,
        rank2017: 7,
        globalShare2007: 3.67,
        globalShare2017: 2.69,
      },
      {
        id: 6,
        country: 'GERMANY',
        unitSales2007: 3482279,
        unitSales2017: 3811246,
        cagr2007_2017: 9.45,
        rank2007: 4,
        rank2017: 5,
        globalShare2007: 4.87,
        globalShare2017: 3.94,
      },
      {
        id: 7,
        country: 'GREECE',
        unitSales2007: 306875,
        unitSales2017: 95363,
        cagr2007_2017: -68.92,
        rank2007: 33,
        rank2017: 57,
        globalShare2007: 0.43,
        globalShare2017: 0.10,
      },
      {
        id: 8,
        country: 'ICELAND',
        unitSales2007: 19305,
        unitSales2017: 24059,
        cagr2007_2017: 24.63,
        rank2007: 85,
        rank2017: 85,
        globalShare2007: 0.03,
        globalShare2017: 0.02,
      },
      {
        id: 9,
        country: 'IRELAND',
        unitSales2007: 236353,
        unitSales2017: 159236,
        cagr2007_2017: -32.63,
        rank2007: 36,
        rank2017: 47,
        globalShare2007: 0.33,
        globalShare2017: 0.16,
      },
      {
        id: 10,
        country: 'ITALY',
        unitSales2007: 2777175,
        unitSales2017: 2190403,
        cagr2007_2017: -21.13,
        rank2007: 7,
        rank2017: 9,
        globalShare2007: 3.88,
        globalShare2017: 2.26,
      },
      {
        id: 11,
        country: 'LUXEMBOURG',
        unitSales2007: 56647,
        unitSales2017: 58965,
        cagr2007_2017: 4.09,
        rank2007: 62,
        rank2017: 64,
        globalShare2007: 0.08,
        globalShare2017: 0.06,
      },
      {
        id: 12,
        country: 'NETHERLANDS',
        unitSales2007: 601534,
        unitSales2017: 508371,
        cagr2007_2017: -15.49,
        rank2007: 20,
        rank2017: 26,
        globalShare2007: 0.84,
        globalShare2017: 0.53,
      },
      {
        id: 13,
        country: 'NORWAY',
        unitSales2007: 182203,
        unitSales2017: 201895,
        cagr2007_2017: 10.81,
        rank2007: 46,
        rank2017: 40,
        globalShare2007: 0.25,
        globalShare2017: 0.21,
      },
      {
        id: 14,
        country: 'PORTUGAL',
        unitSales2007: 276606,
        unitSales2017: 264904,
        cagr2007_2017: -4.23,
        rank2007: 34,
        rank2017: 36,
        globalShare2007: 0.39,
        globalShare2017: 0.27,
      },
      {
        id: 15,
        country: 'SPAIN',
        unitSales2007: 1939298,
        unitSales2017: 1451089,
        cagr2007_2017: -25.17,
        rank2007: 11,
        rank2017: 15,
        globalShare2007: 2.71,
        globalShare2017: 1.50,
      },
    ];

    const mockContinentData = [
      {
        continent: 'Africa',
        y2008: 1255851,
        y2009: 1158774,
        y2010: 1251221,
        y2011: 1446927,
        y2012: 1569463,
        y2013: 1653587,
        y2014: 1717921,
        y2015: 1577535,
        y2016: 1315163,
        y2017: 1195766,
      },
      {
        continent: 'Americas',
        y2008: 20902901,
        y2009: 17497045,
        y2010: 19719981,
        y2011: 21578039,
        y2012: 23670893,
        y2013: 25030005,
        y2014: 25475531,
        y2015: 25688159,
        y2016: 25551912,
        y2017: 25788942,
      },
      {
        continent: 'Asia',
        y2008: 23674121,
        y2009: 27815495,
        y2010: 34830221,
        y2011: 35170777,
        y2012: 37823997,
        y2013: 40215262,
        y2014: 42118003,
        y2015: 43132544,
        y2016: 46598593,
        y2017: 48536953,
      },
      {
        continent: 'Europe',
        y2008: 21337142,
        y2009: 18063406,
        y2010: 18020455,
        y2011: 18851222,
        y2012: 17823295,
        y2013: 17431544,
        y2014: 17759617,
        y2015: 18006261,
        y2016: 19105413,
        y2017: 19913019,
      },
      {
        continent: 'Oceania',
        y2008: 1138239,
        y2009: 1027945,
        y2010: 1137096,
        y2011: 1110406,
        y2012: 1228814,
        y2013: 1263909,
        y2014: 1254548,
        y2015: 1302823,
        y2016: 1337965,
        y2017: 1364075,
      },
    ];

    setCountryData(mockCountryData);
    setContinentData(mockContinentData);
    setMapData(mockCountryData.map((c) => ({
      country: c.country,
      cagr: c.cagr2007_2017,
    })));
  }, [vehicleCategory]);

  const countryColumns = [
    { key: 'id', label: 'ID' },
    { key: 'country', label: 'Country' },
    { key: 'unitSales2007', label: 'Unit Sales 2007', render: (val) => val.toLocaleString() },
    { key: 'unitSales2017', label: 'Unit Sales 2017', render: (val) => val.toLocaleString() },
    { key: 'cagr2007_2017', label: 'CAGR (2007-2017)', render: (val) => `${val.toFixed(2)}%` },
    { key: 'rank2007', label: 'Rank 2007' },
    { key: 'rank2017', label: 'Rank 2017' },
    { key: 'globalShare2007', label: 'Global Share 2007', render: (val) => `${val}%` },
    { key: 'globalShare2017', label: 'Global Share 2017', render: (val) => `${val}%` },
  ];

  const continentColumns = [
    { key: 'continent', label: 'Continent' },
    { key: 'y2008', label: '2008', render: (val) => val.toLocaleString() },
    { key: 'y2009', label: '2009', render: (val) => val.toLocaleString() },
    { key: 'y2010', label: '2010', render: (val) => val.toLocaleString() },
    { key: 'y2011', label: '2011', render: (val) => val.toLocaleString() },
    { key: 'y2012', label: '2012', render: (val) => val.toLocaleString() },
    { key: 'y2013', label: '2013', render: (val) => val.toLocaleString() },
    { key: 'y2014', label: '2014', render: (val) => val.toLocaleString() },
    { key: 'y2015', label: '2015', render: (val) => val.toLocaleString() },
    { key: 'y2016', label: '2016', render: (val) => val.toLocaleString() },
    { key: 'y2017', label: '2017', render: (val) => val.toLocaleString() },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">OICA Data Analysis</h1>

      {/* Sales by country by category */}
      <Card title="Sales by country by category">
        <PillButtons
          options={['All Vehicles', 'Passenger Vehicles', 'Commercial Vehicles']}
          selected={vehicleCategory}
          onSelect={setVehicleCategory}
          className="mb-4"
        />
        <div className="text-gray-500 text-sm">Chart visualization would appear here</div>
      </Card>

      {/* Top N Country Marketers */}
      <Card title="Top N Country Marketers : By Country | Unit Sales | CAGR | Rank | Global Share">
        <DataTable
          data={countryData}
          columns={countryColumns}
          pageSize={15}
        />
      </Card>

      {/* Growth Region on Map */}
      <Card title="Growth Region on Map">
        <OicaMap data={mapData} />
      </Card>

      {/* Volume Units by Continent */}
      <Card title="Volume Units by Continent">
        <PillButtons
          options={['All Vehicles', 'Passenger Vehicles', 'Commercial Vehicles']}
          selected={vehicleCategory}
          onSelect={setVehicleCategory}
          className="mb-4"
        />
        <div className="text-gray-500 text-sm">Chart visualization would appear here</div>
      </Card>

      {/* Continental Market Share */}
      <Card title="Continental Market Share - By Continent Filter">
        <DataTable
          data={continentData}
          columns={continentColumns}
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default OicaModule;

