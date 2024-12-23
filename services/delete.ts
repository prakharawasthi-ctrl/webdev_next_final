import axiosInstance from './axiosInstance';

export const deleteStudent = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/students/delete/${id}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to delete student');
    }
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};
