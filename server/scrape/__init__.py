import time
import requests
import json
import os
import pandas as pd
from bs4 import BeautifulSoup, SoupStrainer
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import ast
import re
from pprint import pprint
import sys
import urllib

mock = {
    "meta": {
        "lines": 1,
        "unicode": False,
        "address_count": 1,
        "verified_count": 1,
        "bytes": 35,
        "character_count": 35
    },
    "addresses": [
        {
            "text": "910 kilbridge lane coppell tx 75019",
            "line": 1,
            "start": 0,
            "end": 35,
            "verified": True,
            "api_output": [
                {
                    "input_index": 0,
                    "candidate_index": 0,
                    "delivery_line_1": "910 Kilbridge Ln",
                    "last_line": "Coppell TX 75019-2061",
                    "delivery_point_barcode": "750192061108",
                    "components": {
                        "primary_number": "910",
                        "street_name": "Kilbridge",
                        "street_suffix": "Ln",
                        "city_name": "Coppell",
                        "default_city_name": "Coppell",
                        "state_abbreviation": "TX",
                        "zipcode": "75019",
                        "plus4_code": "2061",
                        "delivery_point": "10",
                        "delivery_point_check_digit": "8"
                    },
                    "metadata": {
                        "record_type": "S",
                        "zip_type": "Standard",
                        "county_fips": "48121",
                        "county_name": "Denton",
                        "carrier_route": "R016",
                        "congressional_district": "24",
                        "rdi": "Residential",
                        "elot_sequence": "0086",
                        "elot_sort": "A",
                        "latitude": 32.99314,
                        "longitude": -96.99819,
                        "precision": "Zip9",
                        "time_zone": "Central",
                        "utc_offset": -6,
                        "dst": True
                    },
                    "analysis": {
                        "dpv_match_code": "Y",
                        "dpv_footnotes": "AABB",
                        "dpv_cmra": "N",
                        "dpv_vacant": "N",
                        "dpv_no_stat": "N",
                        "active": "Y",
                        "footnotes": "N#"
                    }
                }
            ]
        }
    ]
}

#local inputs
from controller import dbController

def address_extraction_api(inputString):
    id = os.getenv('SS_AUTH-ID')
    token = os.getenv('SS_AUTH-TOKEN')
    #print(f"id is {id} and token is {token}")
    #print(f"here are the environments: {os.environ}")
    
    #USE SMARTYSTREETS API TO PARSE ADDRESS AND GET LAT AND LONG
    url = f'https://us-extract.api.smartystreets.com?auth-id=7f6d7e2c-f659-a7dd-eb3d-fc3e772a3c80&auth-token=ge4NcF15QJYEKSLlcCTM'
    addressData = requests.post(url = url, data=inputString)
    addressData = addressData.json()
    # FIXME when you want to use api instead of mock fix
    # addressData = mock
    street = addressData['addresses'][0]['api_output'][0]['delivery_line_1']
    city = addressData['addresses'][0]['api_output'][0]['components']['city_name']
    state = addressData['addresses'][0]['api_output'][0]['components']['state_abbreviation']
    zipcode = addressData['addresses'][0]['api_output'][0]['components']['zipcode']
    latitude = addressData['addresses'][0]['api_output'][0]['metadata']['latitude']
    longitude = addressData['addresses'][0]['api_output'][0]['metadata']['longitude']
    print(f"{street}, {city}, {state}, {zipcode}, {latitude}, {longitude}")
    return [ street, city, state, zipcode, latitude, longitude ]
    

def scrape_op_info(operatorId):
    options = webdriver.ChromeOptions()
    options.headless = True
    options.add_argument("window-size=1920x1080")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    # options.add_argument('--disable-dev-shm-usage') # Not used 

    driver = webdriver.Chrome(options=options)
    operatorNumber = operatorId
    url = 'http://webapps2.rrc.texas.gov/EWA/organizationQueryAction.do'

    driver.get(url)
    driver.find_element_by_name("unused").click()
    driver.find_element_by_name("operatorNumber").send_keys(operatorNumber)
    driver.find_element_by_xpath("//input[@type='text' and @name='operatorNumber']").send_keys(operatorNumber)
    driver.find_element_by_xpath('//input[@value="Search" and @type="button"]').click()
    driver.find_elements_by_css_selector('td')
    time.sleep(1)

    driver.find_element_by_xpath(f"//option[@value={operatorNumber}]").click()
    driver.find_element_by_xpath('//input[@value="Add" and @type="button"]').click()
    driver.find_element_by_xpath('//input[@value="Submit" and @type="submit"]').click()
    driver.find_element_by_xpath('//input[@value="Submit" and @type="submit"]').click()
    driver.find_element_by_xpath(f"//*[contains(text(), {operatorNumber})]").click()
    
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    test = soup.find_all( "table", {"class":"DataGrid"} )[1]

    operatorData = []
    newOperator = {}
    key=""
    value=""

    for tag in test.find_all("td"):
        operatorData.append(' '.join(tag.text.split()))

    for index, item in enumerate(operatorData):
        if (index%2==0):
            key = item
        else:
            value = item
            newOperator[key] = value

    
    df = pd.DataFrame(newOperator, index=[0])
    locationAddress = df['Location Address:'][0]
    mailingAddress = df['Mailing Address:'][0]
    df[["lStreet", "lCity", "lState", "lZip", "lLat", "lLong"]] = address_extraction_api(locationAddress)
    df[["mStreet", "mCity", "mState", "mZip", "mLat", "mLong"]] = address_extraction_api(mailingAddress)
    del(df['Location Address:'])
    df.pop('Mailing Address:')
    # df[["street", "city", "state", "zip"]] = fullAddress.str.extract('(.+)[ ]{3}(.+)\,[ ]([a-zA-z]{2})[ ]([0-9]{5})',expand=True)
    print(df.transpose().to_markdown())
    dbController.addOperator(df)
    driver.quit()

def scrape_for_op_leases(opId):
    operatorNumber = opId
    options = webdriver.ChromeOptions()
    options.headless = True
    options.add_argument("window-size=1920x1080")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    # options.add_argument('--disable-dev-shm-usage') # Not used 

    driver = webdriver.Chrome(options=options)
    url = 'http://webapps.rrc.texas.gov/PDQ/generalReportAction.do'

    driver.get(url)
    driver.find_element_by_xpath('//input[@value="Operator" and @type="radio" and @name="viewType"]').click()

    districtOption = driver.find_element_by_xpath('//select[@name="district"]')
    drop_a_sonic_down = Select(districtOption)
    drop_a_sonic_down.select_by_visible_text("Statewide")

    driver.find_element_by_xpath('//input[@value="Search For Operator" and @type="submit"]').click()
    driver.find_element_by_xpath('//input[@name="operatorSearchValue" and @type="text"]').send_keys(operatorNumber)
    driver.find_element_by_xpath('//input[@value="exactMatch" and @type="radio"]').click()
    driver.find_element_by_xpath('//input[@value="Search" and @type="submit"]').click()
    
    operatorOption = driver.find_element_by_xpath('//select[@name="selectedOperatorValue"]')
    drop_a_tails_down = Select(operatorOption)
    drop_a_tails_down.select_by_index(0)

    driver.find_element_by_xpath('//input[@value="Submit" and @type="submit"]').click()

    startYear = driver.find_element_by_xpath('//select[@name="startYear"]')
    startYearDrop = Select(startYear)
    startYearDrop.select_by_visible_text("1993")

    driver.find_element_by_xpath('//input[@value="Submit" and @type="submit" and @name="submit"]').click()
    driver.find_elements_by_xpath("//a[contains(text(), 'Lease')]")[1].click()

    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    # pattern = re.compile('Lease')
    # test = soup.find_all("a", text=pattern)
    dataTable = soup.find("table", {"class": "DataGrid"})
    leases = []
    for row in dataTable.find_all("tr"):
        
        rowList = row.text.strip().rstrip().replace(',','').splitlines()
        
        rowList = [item for item in rowList if item.strip()]
        rowList = [item.lstrip() for item in rowList]
        if rowList[0] == "Lease name" or rowList[0] == "Total":
            continue
        newLease = {
            "operatorId": operatorNumber,
            "leaseId": rowList[1],
            "name": rowList[0],
            "district": rowList[2],
            "oil": rowList[len(rowList)-4],
            "casingGas": rowList[len(rowList)-3],
            "gwGas": rowList[len(rowList)-2],
            "condensate": rowList[len(rowList)-1]
        }
        time.sleep(.25)
        dbController.addLease(newLease)
        # x=1
        # if len(newLease['district']) == 2:
        #     leases.append(newLease)
        #     if x <= 1:
        #         getFieldAndProduction(newLease, driver)
        #         x = x +  1
    driver.quit()

def getFieldAndProduction(lease, districted, operatorId2):
    
    options = webdriver.ChromeOptions()
    options.headless = True
    options.add_argument("window-size=1920x1080")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)
    url = 'http://webapps.rrc.texas.gov/PDQ/quickLeaseReportBuilderAction.do'

    driver.get(url)
    #FIXME THIS WILL FAIL SOMETIMES BC ONLY CHECKING OIL LEASE RADIO BUTTON  NEED TO PUT A CONDITION IN HERE THAT 
    #CHECKS IF WE HAD DATA RETURNED OR FOR LEASE DOES NOT EXIST
    driver.find_element_by_xpath('//input[@value="Oil" and @type="radio" and @name="wellType"]').click()
    driver.find_element_by_xpath('//input[@name="leaseNumber" and @type="text"]').send_keys(lease)

    district = driver.find_element_by_xpath('//select[@name="district"]')
    districtDrop = Select(district)
    districtDrop.select_by_visible_text(districted)

    startYear = driver.find_element_by_xpath('//select[@name="startYear"]')
    startYearDrop = Select(startYear)
    startYearDrop.select_by_visible_text("1993")

    endMonth = driver.find_element_by_xpath('//select[@name="endMonth"]')
    endMonthDrop = Select(endMonth)
    endMonthDrop.select_by_visible_text("Dec")

    driver.find_element_by_xpath('//input[@value="Submit" and @type="submit" and @name="submit"]').click()
    try:
        driver.find_elements_by_xpath("//a[contains(text(), 'View All Results')]")[0].click()
    except:
        print("all results fit on one page")
    time.sleep(1)
    
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    try:
        dataTable = soup.find_all("table", {"class": "DataGrid"})[0]
    except:
        dataTable = []
        print("there is no production data")
    
    operatorProduction = []
    rowList = []
    try:
        for tag in dataTable.find_all("tr"):
            rowList = tag.text.strip().rstrip().replace(',','').splitlines()
            rowList = [item for item in rowList if item.strip()]
            rowList = [item.lstrip() for item in rowList]
            operatorProduction.append(rowList)
    except:
        print("No <tr> data")

    if (len(operatorProduction) > 0):        
        operatorProduction = operatorProduction[2:]
        operatorProduction.pop()
        productions = []
        operatorId = operatorId2
        fieldId = ''
        
        try:
            for leaseProd in operatorProduction:
                if (len(leaseProd) == 9):
                    fieldId = leaseProd[len(leaseProd)-1]
                    operatorId = leaseProd[len(leaseProd)-3]
                elif (len(leaseProd) == 7):
                    operatorId = leaseProd[len(leaseProd)-1]
                
                leaseProduction = {
                    "operatorId": operatorId,
                    "leaseId": lease,
                    "fieldId": fieldId,
                    "month": leaseProd[0].split()[0],
                    "year": leaseProd[0].split()[1],
                    "oilProd": leaseProd[1],
                    "oilDisp": leaseProd[2],
                    "gasProd": leaseProd[3],
                    "gasDisp": leaseProd[4],
                }
                dbController.addProduction(leaseProduction)
                productions.append(leaseProduction)

            productions = pd.DataFrame(productions)    
            print(productions.to_markdown())
        except:
            print("something scraped very wrong")
    driver.quit()

def scrapeRegData(month):
    try:
        production = 'Oil'
        district = "8A"
        #fieldId = '58327200'
        fieldId = '44313666'
        #fieldId = '91818500'
        options = webdriver.ChromeOptions()
        options.headless = True
        options.add_argument("window-size=1920x1080")
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Chrome(options=options)
        url = 'https://rrc.texas.gov/oil-and-gas/research-and-statistics/proration-schedules/field/'
        textUrl = 'https://portalvhdskzlfb8q9lqr9.blob.core.windows.net/media/56511/oilsch8a.txt' 
        driver.get(url)
        driver.find_elements_by_xpath("//a[contains(text(), 'March')]")[1].click()
        time.sleep(1)

        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")
    
        elem = soup.find_all("a", text=re.compile(r'.*' + production + ' District' + '*.'))
        if (district == '1'):
            textUrl = elem[0]['href']
        elif (district == '2'):
            textUrl = elem[1]['href']
        elif (district == '3'):
            textUrl = elem[2]['href']
        elif (district == '4'):
            textUrl = elem[3]['href']
        elif (district == '5'):
            textUrl = elem[4]['href']
        elif (district == '6'):
            textUrl = elem[5]['href']
        elif (district == '6E'):
            textUrl = elem[6]['href']
        elif (district == '7B'):
            if (production == 'Oil'):
                textUrl = elem[7]['href']
            elif (production == 'Gas'):
                textUrl = elem[6]['href']
        elif (district == '7C'):
            if (production == 'Oil'):
                textUrl = elem[8]['href']
            elif (production == 'Gas'):
                textUrl = elem[7]['href']
        elif (district == '8'):
            if (production == 'Oil'):
                textUrl = elem[9]['href']
            elif (production == 'Gas'):
                textUrl = elem[8]['href']
        elif (district == '8A'):
            if (production == 'Oil'):
                textUrl = elem[10]['href']
            elif (production == 'Gas'):
                textUrl = elem[9]['href']
        elif (district == '9'):
            if (production == 'Oil'):
                textUrl = elem[11]['href']
            elif (production == 'Gas'):
                textUrl = elem[10]['href']
        elif (district == '10'):
            if (production == 'Oil'):
                textUrl = elem[12]['href']
            elif (production == 'Gas'):
                textUrl = elem[11]['href']
        print("here is your url: ", textUrl)
        textFileList = []
        file = urllib.request.urlopen(str(textUrl))
        for line in file:
            decode = line.decode('ISO-8859-1')
            textFileList.append(decode)
        
        textFileList = [line.strip() for line in textFileList]
        fieldRules = []
        foundField = False;
        gasCounter = 1;
        if (production == 'Gas'):
            gasCounter = 0;
            fieldId = 'NEWARK, EAST (BARNETT SHALE)'
        for index, line in enumerate(textFileList):
            if fieldId in line and foundField == False:
                if gasCounter == 1:
                    print('found it', line)
                    print('index: ', index)
                    print('len fo file: ', len(textFileList))
                    foundField = True
                    for i in range(index, len(textFileList)):
                        if (production == 'Gas'):
                            if ( 'IDENT' in textFileList[i] ):
                                print('ident in the house yo')
                                break
                            else:
                                fieldRules.append(textFileList[i])
                        elif ( 'MVBAL' in textFileList[i] ):
                            break
                        else:
                            fieldRules.append(textFileList[i])
                else:
                    gasCounter += 1

        fieldRules = [' '.join(rule.split()) for rule in fieldRules]
        fieldRules = [rule.replace('*', '').strip() for rule in fieldRules]
        print(len(fieldRules))
        print(fieldRules)
        # driver.quit()
        # depth = fieldRules[0].split(':')[1]
        # cumulativeProduction = fieldRules[1].split('- ')[1]
        # attributeSubset = fieldRules[2].split(' ,')
        # discovered = attributeSubset[0].split(':')[1]
        # gravity = attributeSubset[1].split(':')[1]
        # ratio = attributeSubset[2].split(':')[1]
        # allow = attributeSubset[3].split(':')[1]
        # spacing = attributeSubset[4].split(':')[1]
        # field = {
        #     'depth': str(depth).strip(),
        #     'cumulativeProduction': int(cumulativeProduction),
        #     'discovered': str(discovered),
        #     'gravity': gravity,
        #     'ratio': ratio.strip(),
        #     'allow': allow.strip(),
        #     'spacing': spacing.strip()
        # }
        # print('field: ', field)
    except:
        print("Unexpected error:", sys.exc_info())
    

