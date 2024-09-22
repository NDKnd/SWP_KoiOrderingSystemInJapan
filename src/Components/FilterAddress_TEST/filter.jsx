import React, { useState, useEffect } from 'react';

function FilterAddress() {

    const [country, setCountry] = useState([]);
    //Ch có 1 quốc gia đc chọn nên generate empty string ('')
    //Chỉ 1 quốc gia đc chọn
    const [selectedCountry, selectCountry] = useState('');
    const [city, setCity] = useState([]);
    const [selectedCity, selectCity] = useState('');
    const [state, setState] = useState([]);
    const [selectedState, selectState] = useState('');

    
    //Goi API 
    const urlCou = 'https://api.countrystatecity.in/v1/countries' ;
    useEffect(() => {
        const fethData = async () => {
            const res = await fetch(urlCou);
            const datas = await res.json();

        }
    }, [])


    return (
        <>
            <h1>Country, city, state</h1>
            <section>
                <form>
                    <label>
                        Country:
                        <select name="country" onChange={e => selectCountry(e.target.value)}>
                            {/* Lấy dữ liệu country từ API bằng cách */}
                            <option value="">Select country</option>
                            {renderOpts(country, 'country_id', 'country_name')}
                        </select>
                    </label>
                    <label>
                        City:
                        <select name="city" onChange={e => selectCity(e.target.value)}>
                            <option value="">Select a city</option>


                        </select>
                    </label>
                    <label>
                        State:
                        <select name="state" onChange={e => console.log(e.target.value)}>
                            <option value="">Select a state</option>

                        </select>
                    </label>
                </form>

            </section>
        </>
    );
}

export default FilterAddress;