import { Request } from 'express';
import axios, { AxiosError } from 'axios';
import { Environment } from '../config/environment';
import { AddressResponseType } from '../type/address.type';

export interface Errors extends AxiosError {
	errors: unknown | never;
}

export const getProvinces = async (req: Request, res: AddressResponseType) => {
	try {
		const response = await axios.get(
			`${Environment.regionAPI}/provinces.json`
		);

		return res.status(200).json({
			message: 'Success',
			data: response.data,
		});
	} catch (error: unknown) {
		const errors = error as AxiosError;
		return res.status(500).json({ errors } as Errors);
	}
};

export const getRegencies = async (req: Request, res: AddressResponseType) => {
	const { id } = req.params;
	try {
		const response = await axios.get(
			`${Environment.regionAPI}/regencies/${id}.json`
		);

		return res.status(200).json({
			message: 'Success',
			data: response.data,
		});
	} catch (error: unknown) {
		const errors = error as AxiosError;
		return res.status(500).json({ errors } as Errors);
	}
};

export const getDistricts = async (req: Request, res: AddressResponseType) => {
	const { id } = req.params;
	try {
		const response = await axios.get(
			`${Environment.regionAPI}/districts/${id}.json`
		);

		return res.status(200).json({
			message: 'Success',
			data: response.data,
		});
	} catch (error: unknown) {
		const errors = error as AxiosError;
		return res.status(500).json({ errors } as Errors);
	}
};

export const getVillages = async (req: Request, res: AddressResponseType) => {
	const { id } = req.params;
	try {
		const response = await axios.get(
			`${Environment.regionAPI}/villages/${id}.json`
		);

		return res.status(200).json({
			message: 'Success',
			data: response.data,
		});
	} catch (error: unknown) {
		const errors = error as AxiosError;
		return res.status(500).json({ errors } as Errors);
	}
};
