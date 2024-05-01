import { baseUrl } from "../../common/config/constans";

class getUserResource {
  constructor(data) {
    this.fullName = data.fullName;
    this.email = data.email;
    this.profile = data.profileImage ? baseUrl() + data.profileImage : null;
  }
}

export default getUserResource;
