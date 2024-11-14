import React from 'react';
import defaultImage from '../../static/pictures/EmptyCard.jpg';


interface IPictureBlock {
    previewImage: string,
    skeletonLoading?: {status: boolean, isSuccessful?: boolean},
}

const PictureBlock = (props: IPictureBlock) => {
    const imageSrc = props.previewImage ? props.previewImage : defaultImage;
    
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
                    src={imageSrc}
                />                   
            </>)
        }
    }

    return (
        <div className="picture_block">
            <div className="picture_block__container">
                {pictureView}
            </div>
        </div>
    );
};

export default PictureBlock;