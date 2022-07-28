require('dotenv').config();
const fetch = require('node-fetch')
let token;

function getCredentialsInBase64(username, password) {
	return Buffer.from(`${username}:${password}`).toString('base64');
}

async function getToken() {
	const username = process.env.USER_MANAGEMENT_API || '';
	const password = process.env.PASS_MANAGEMENT_API || '';

	const myHeaders = {
        Authorization: 'Basic ' + getCredentialsInBase64(username, password)
    }

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		redirect: 'follow',
	};

	let response = await fetch(
		'https://8de277f7trial.authentication.us10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token',
		requestOptions
	)
    let data = await response.json()
    return data.access_token
}

async function registerUser() {
	const username = process.env.USER || '';
	const password = process.env.PASSWORD || '';

	const myHeaders = {
        'Content-Type': 'application/scim+json',
        'Authorization': 'Basic ' + getCredentialsInBase64(username, password)
    }

	var raw = JSON.stringify({
		schemas: ['urn:ietf:params:scim:schemas:core:2.0:User', 'urn:ietf:params:scim:schemas:extension:sap:2.0:User'],
		userName: '',
		name: {
			familyName: 'Test',
			givenName: 'Anubis',
		},
		userType: 'employee',
		active: true,
		displayName: 'Anubis Test',
		emails: [
			{
				value: 'anubis11anonymous@gmail.com',
				primary: true,
			},
		],
		'urn:ietf:params:scim:schemas:extension:sap:2.0:User': {
			sendMail: true,
			emails: [
				{
					verified: true,
					value: 'anubis11anonymous@gmail.com',
					primary: true,
				},
			],
			mailVerified: true,
		},
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	let response = await fetch('https://aryok8fpf.accounts.ondemand.com/scim/Users', requestOptions);
    if(!response.ok){
        throw new Error('Error to register user')
    }
    return response.json()
}

async function createUser() {
    !token && (token = await getToken());

	const myHeaders = {
        Authorization: 'Bearer '+token,
        'Content-Type': 'application/json'
    }

	var raw = JSON.stringify({
		meta: {
			attributes: ['string'],
			version: 1,
			created: '2022-07-27T16:38:59.917Z',
			lastModified: '2022-07-27T16:38:59.917Z',
		},
		userName: 'anubis11anonymous@gmail.com',
		name: {
			familyName: 'Anubis',
			givenName: 'Test',
		},
		emails: [
			{
				value: 'anubis11anonymous@gmail.com',
				primary: true,
			},
		],
		active: true,
		verified: true,
		origin: 'sap.default',
		zoneId: '4093bbfb-8cd9-43a8-80eb-9ad18c3b7a5f',
		schemas: ['urn:scim:schemas:core:1.0'],
	});

	var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	let response = await fetch('https://api.authentication.us10.hana.ondemand.com/Users', requestOptions)
    if(!response.ok){
        throw new Error('Error to create user')
    }
    return response.json()
}

//This is a not necessary  process, because the role collection id it's the same as the role collection name
async function getRolCollection(rolCollName) {

    !token && (token = await getToken());

	const myHeaders = {
        Authorization: 'Bearer '+token
    }

	var requestOptions = {
		method: 'GET',
		headers: myHeaders,
		redirect: 'follow',
	};

	let response = await fetch(`https://api.authentication.us10.hana.ondemand.com/Groups/${rolCollName}`, requestOptions)
	if(!response.ok){
        throw new Error('Error to get role Collections')
    }
    return response.json()
}

async function setRolToUser(rolCollName, userId) {

    !token && (token = await getToken());

	const myHeaders = {
        Authorization: 'Bearer '+token,
        'If-Match': '1',
        'Content-Type': 'application/json'
    }

	var raw = JSON.stringify({
		id: rolCollName,
		meta: {
			version: 1,
			created: '2022-07-27T16:52:32.964Z',
		},
		displayName: rolCollName,
		zoneId: '4093bbfb-8cd9-43a8-80eb-9ad18c3b7a5f',
		description: 'Administrative access to service brokers and environments on a subaccount level.',
		members: [
			{
				origin: 'sap.default',
				type: 'USER',
				value: userId,
			},
		],
		schemas: ['urn:scim:schemas:core:1.0'],
	});

	var requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	let response = await fetch(`https://api.authentication.us10.hana.ondemand.com/Groups/${rolCollName}`, requestOptions)
	if(!response.ok){
        throw new Error('Error asign role to user')
    }
    return response.json()
}

async function run() {
    try{
        const roleCollection = 'Subaccount Service Administrator'
        await registerUser();
        let user = await createUser();
        let roleInfo = await getRolCollection(roleCollection);
        setRolToUser(roleInfo.id, user.id);
        console.log('process finished')
    }catch(err){
        console.error(err)
    }
}

run();
