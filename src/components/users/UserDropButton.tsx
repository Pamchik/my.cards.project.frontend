import ButtonMain from '../UI/buttons/ButtonMain';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { removeSessionId } from '../../store/user/sessionIdSlice'
import Cookies from 'js-cookie';
import { removeUser } from '../../store/user/userSlice';


const UserDropButton = () => {

    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.user)

    const userName = user.username || "unknown"
    const userRole = user.role || "unknown"

    // Открытие страницы "Profile" по кнопке
        const navigate = useNavigate();
        const funcHandleProfile = () => {
            navigate(`profile/`);
        };

    return (
        <ButtonMain
            onClick={() => {}}
            type={'other'}
            title={`${userName} | ${userRole}`}
            color={'transparent'}
            drop={true}
            actions={[
                {name: "Профиль", onClick: () => funcHandleProfile()}, 
                {
                    name: "Выйти", 
                    onClick: () => (
                        Cookies.remove('sessionid'),
                        dispatch(removeSessionId(null)),
                        dispatch(removeUser({}))
                    ), 
                    myStyle:{color: 'red'}}
            ]}
            myStyle={{padding: '0 5px', width: 'auto', fontWeight: 'bold', fontSize: '11pt'}}
        />
    );
};

export default UserDropButton;

