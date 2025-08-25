import { useState, ChangeEvent, FormEvent } from "react";
import { FormData } from "../../types/index";

export default function Form() {
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        address: "",
        bio: "",
        profileImageUrl: "",
        verificationStatus: false,
        socialLinks: "",
        phoneNumber: "",
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submitAPI = "http://localhost:8081/profile/create";
        const formDtoken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(submitAPI, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${formDtoken}`,
                },
                body: JSON.stringify(formData),
            });
console.log(response);
            // const result = await response.json();
            console.log("Data submitted successfully:", result);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Basic React Form (TypeScript)</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="block font-medium">Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Bio:</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium">Profile Image URL:</label>
                    <input
                        type="text"
                        name="profileImageUrl"
                        value={formData.profileImageUrl}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="verificationStatus"
                        checked={formData.verificationStatus}
                        onChange={handleChange}
                    />
                    <label className="font-medium">Verified</label>
                </div>

                <div>
                    <label className="block font-medium">Social Links (comma separated):</label>
                    <input
                        type="text"
                        name="socialLinks"
                        value={formData.socialLinks}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </form>

            <div className="mt-6">
                <h3 className="font-semibold">Current State:</h3>
                <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>
        </div>
    );
}
