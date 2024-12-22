import axiosInstance from "./axiosInstance";

export const addStudent = async (newStudent: any) => {
  try {
    const response = await axiosInstance.post("/students/add", newStudent);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to add student");
    }
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};
