import React, { useState, useEffect } from 'react';
import defaultImage from '../../static/pictures/EmptyCard.jpg';

interface IPictureUploadBlock {
    onChange: (file: File) => void,
    isReadOnly?: boolean,
    value?: string,
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
}

const PictureUploadBlock = (props: IPictureUploadBlock) => {

    // Название выбранного изображения
        const [isNewImageSelected, setIsNewImageSelected] = useState<boolean>(false);
        const [imageName, setImageName] = useState<string>('Выберите изображение');

    // Input значение
        const [inputValue, setInputValue] = useState<string | null>(null);
        useEffect(() => {
            if (!isNewImageSelected || props.isReadOnly) {
                if (props.value === undefined || props.value === null) {
                    setInputValue(null);
                } else if (typeof props.value === 'string') {
                    setInputValue(props.value);
                }
            } 
        }, [props.value, props.isReadOnly]);
        
    // Обнуление локальных состояний при открытии редактирования
        useEffect(() => {
            setIsNewImageSelected(false)
            setImageName('Выберите изображение')
        },[props.isReadOnly])

    // Функция изменения изображения
        const funcHandleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files[0]) {
                
                const file = new FileReader();
                const fileLoaded = event.target.files[0];

                file.onload = (e) => {
                    if (typeof e.target?.result === 'string') {
                        setInputValue(e.target.result);
                        setIsNewImageSelected(true);
                        setImageName(fileLoaded.name);
                    }
                };

                const fileInput = event.target;
                fileInput.value = '';

                file.readAsDataURL(fileLoaded);
                props.onChange(fileLoaded);
            }
        };

        let pictureView;
        if (!props.skeletonLoading || props.skeletonLoading.status) {
            pictureView = (<>
                <div
                    style={{resize: 'none', width: '100%', backgroundColor:'rgba(151, 36, 36, 0)', height: `150px`}}
                    className={`picture_block__picture skeleton-loading`} 
                ></div>
            </>)
        } else {
            if (props.skeletonLoading && !props.skeletonLoading.status && !props.skeletonLoading.isSuccessful) {
                pictureView = (<>
                    <div
                        style={{resize: 'none', width: '100%', backgroundColor:'rgba(151, 36, 36, 0)', height: `150px`}}
                        className={`picture_block__picture`} 
                    >
                        <div className='picture_block__picture_error-block'>
                            <div 
                                className={`picture_block__picture_error`} 
                            >
                                <svg />
                            </div>
                        </div>
                    </div>                    
                </>)
            } else {
                pictureView = (<>
                    <img
                        className="picture_block__picture"
                        src={inputValue ? inputValue : defaultImage}
                    />                   
                </>)
            }
        }

  
    return (
        <div className="picture_block">
            <div className="picture_block__container">
                {!props.isReadOnly 
                ? 
                    !isNewImageSelected ? (
                        <label className="picture_block__label" htmlFor="image-input">
                            {imageName}
                        </label>            
                    ) : (
                        <label className="picture_block__label" htmlFor="image-input">
                            <svg/>
                            {imageName}
                        </label>            
                    )
                : ''
                }
              
                <input
                    className="picture_block__input"
                    type="file"
                    id="image-input"
                    accept="image/*"
                    onChange={funcHandleImageChange}
                    
                />
                {pictureView}

            </div>
        </div>
    );
};

export default PictureUploadBlock;



