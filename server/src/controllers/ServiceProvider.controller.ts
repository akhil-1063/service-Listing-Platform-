import { type Request,  type Response} from "express";
import {ServiceProvider} from "../models/ServiceProvider.js";




// Creating a new service provider

export const createServiceProvider = async (req : Request, res : Response) : Promise<void> => {


    try {

        const { name, category, description, location, imageUrl } = req.body;

        if (!name || !category || !description || !location || !imageUrl) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

    
        const newServiceProvider = await ServiceProvider.create({
            name,
            category,
            description,
            location,
            imageUrl
        });
        res.status(201).json({ message: "Service provider created successfully", data: newServiceProvider });
    } catch (error) {
        res.status(500).json({ message: "Error creating service provider", error });
    };
};


// Getting all service providers

export const getAllServiceProviders  = async(req : Request, res : Response) : Promise<void> => {

    try {
    const serviceProviders = await ServiceProvider.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Service providers retrieved successfully", data: serviceProviders, count: serviceProviders.length });
} catch (error) {
    res.status(500).json({ message: "Error retrieving service providers", error });
}
};


//Getting a single service provider by ID

export const getServiceProviderById = async(req : Request, res : Response) : Promise<void> => {

    try {
        const{ id } = req.params; 

        const provider = await ServiceProvider.findById(id);

        if (!provider) {
            res.status(404).json({ message: "Service provider not found" });
            return;
        }
            res.status(200).json({ message: "Service provider retrieved successfully", data: provider });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving service provider", error });
    }
};

//Update the service provider by ID

export const updateServiceProviderById = async(req : Request, res : Response) : Promise<void> => {

    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

        if(!updatedProvider) {
            res.status(404).json({ message: "Service provider not found" });
            return;
        }
        res.status(200).json({ message: "Service provider updated successfully", data: updatedProvider });
    } catch (error) {
        res.status(500).json({ message: "Error updating service provider", error });
    }
};

// Delete the service provider by ID

export const deleteServiceProviderById = async(req : Request, res : Response) : Promise<void> => {

    try {
        const { id } = req.params;
        const deletedProvider = await ServiceProvider.findByIdAndDelete(id);

        if(!deletedProvider) {
            res.status(404).json({ message: "Service provider not found" });
            return;
        }
        res.status(200).json({ message: "Service provider deleted successfully", data: deletedProvider });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service provider", error });
    }
};















