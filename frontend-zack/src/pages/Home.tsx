import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Upload from "../assets/images/upload.png";
import { AuthService, ImageService } from "../services/apiService";
import { Input } from "@/components/ui/input";

export default function Home() {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(0);
  const [count, setCount] = useState({
    Images: 0,
    screenShots: 0
  });

  const handleUpload = useCallback(
    async (uploadedFile: File[]) => {
      if (!uploadedFile) return;

      setUploading(true);

      try {
        const response = await ImageService.upload(uploadedFile, (progress) => {
          const percentage = Math.round(
            (progress.loaded / (progress.total ?? 100)) * 100
          );
          setProgress(percentage);
        });
        const name = response.data.files;
        if (name) {
          navigate(`/share/${name.join(",")}`);
          toast.success("Your image has been uploaded successfully!", {
            autoClose: 5000,
          });
        } else {
          toast.error(response.data.error);
        }
      } catch (e) {
        toast.error("Something went wrong. Please, try again.");
        console.error(e);
      } finally {
        setUploading(false);
      }
    },
    [navigate]
  );

  useEffect(() => {
    const dragEnter = (e: DragEvent) => {
      e.preventDefault();
      setDragging((a) => a + 1);
    };

    const dragLeave = (e: DragEvent) => {
      e.preventDefault();
      setDragging((a) => a - 1);
    };

    const drop = (e: DragEvent) => {
      e.preventDefault();

      if (e.type === "dragover") return;

      setDragging(0);

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        handleUpload(Array.from(files));
      }
    };

    document.addEventListener("dragenter", dragEnter);
    document.addEventListener("dragleave", dragLeave);
    document.addEventListener("drop", drop);
    document.addEventListener("dragover", drop);

    return () => {
      document.removeEventListener("dragenter", dragEnter);
      document.removeEventListener("dragleave", dragLeave);
      document.removeEventListener("drop", drop);
      document.removeEventListener("dragover", drop);
    };
  }, [navigate, handleUpload]);

  useEffect(() => {
    if (query.has("confirm")) {
      AuthService.verify(query.get("confirm") ?? "");

      toast.success("Your account has been verified!", {
        autoClose: 5000,
      });
    }
  }, [query]);

  useEffect(() => {
    ImageService.count()
      .then((count) => {
        setCount({
          Images: count.Images,
          screenShots: count.screenShots
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container>
      {createPortal(
        dragging > 0 ? (
          <UploadZone>
            <img src={Upload} alt="Upload" />
            <h1>Drag and drop you image here to begin uploading!</h1>
            <UploadText>
              Alternatively, you can select your images using the "upload"
              button.
            </UploadText>
          </UploadZone>
        ) : null,
        document.getElementById("root")!
      )}

      <Content>
        <Title>
          Upload and <span>Share</span> your Images!
        </Title>
        <UploadText>
          Click the upload button, or drag and drop your image to begin!
        </UploadText>
        <br />
        <StyledInput
          type="file"
          id="imageUpload"
          onChange={(e) => handleUpload(Array.from(e.target.files ?? []))}
          accept=".png,.jpg,.jpeg,.gif"
          hidden
          multiple
        />
        {!uploading ? (
          <UploadLabel htmlFor="imageUpload" id="up">
            <span><img src={Upload} alt="upload-icon" /> Upload Image</span>
          </UploadLabel>
        ) : (
          <UploadLabel id="up">
            <span> UPLOADING...</span>
            <ProgressBar>
              <Progress style={{ width: `${progress}%` }}></Progress>
            </ProgressBar>
          </UploadLabel>
        )}
        <Info>
          <p><span>{count.Images}</span> Images Uploaded</p>
          <p><span>{count.screenShots}</span> Screenshot Token</p>
        </Info>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15rem;

   @media(max-width: 1500px) {
    height: 100vh;
    margin-bottom: 25rem;
  }
`;

const UploadZone = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.91);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: #fff;

  h1 {
    font-size: 24px;
    margin-top: 20px;
  }
`;

const UploadText = styled.p`
  font-family: "YuGothic", sans-serif;
  font-weight: 300;
  font-size: 18px;
  color: #fff;
  margin-top: -10px;

  @media(max-width: 768px) {
    font-size: 12px;
    margin-top: -5px;
  }
`;

const Content = styled.div`
  text-align: center;
  color: #fff;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 2.5rem;

  span {
    color: #ea1ebd;
  }

  @media(max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const StyledInput = styled(Input)`
  display: none;
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(to bottom right, rgb(214, 30, 238), #ff2092);
  box-shadow: 0px 0px 3px 5px rgba(90, 13, 100, 0.77);
  border-radius: 5px;
  overflow: hidden;
  margin: auto;
  width: 35%;

  span {
    margin: auto;
    font-size: 1.1rem;
    font-weight: 300;
    display: flex;
    gap: 5px;
    flex-direction: row;
    align-items: center;
    text-shadow: 0px 1.5px #00000078;

    img {
      width: 25px;
      text-shadow: 0px 1.5px #00000078;
    }
  }
    
   @media(max-width: 768px) {
    width: 50%;
    
    span {
      font-size: 1rem;
    }
  }
`;

const ProgressBar = styled.div`
  height: 0.75rem;
  width: 100%;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
`;

const Progress = styled.div`
  height: 100%;
  background: #ea1ebd;
  transition: width 0.3s ease;
`;

const Info = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;

  p {
    span {
      color: #ea1ebd;
    }
  }
`;