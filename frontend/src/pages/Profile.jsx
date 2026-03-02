import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;

  const dispatch = useDispatch();

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "user",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("profilePic", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user)); // backend returns user
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs defaultValue="profile" className="max-w-7xl mx-auto items-center">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-bold mb-7 text-2xl text-gray-800">
              Update Profile
            </h1>

            <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
              {/* PROFILE IMAGE */}
              <div className="flex flex-col items-center">
                <img
                  src={updateUser.profilePic || "/default.png"}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                />

                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 shadow-lg p-5 rounded-lg bg-white w-full"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={updateUser.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={updateUser.email} disabled />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={updateUser.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Zip</Label>
                  <Input
                    name="zipCode"
                    value={updateUser.zipCode}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-3 bg-pink-600 text-white hover:bg-pink-700 rounded-lg cursor-pointer"
                >
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="p-6 text-center text-gray-500">
            Orders content here...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
