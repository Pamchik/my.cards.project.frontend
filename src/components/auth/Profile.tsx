import UserMainInfo from './UserMainInfo';
import UserPassword from './UserPassword';


const Profile = () => {

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            <UserMainInfo/> 
            <div style={{height: '20px'}}></div>
            <UserPassword/>
        </div>
    );
};

export default Profile;