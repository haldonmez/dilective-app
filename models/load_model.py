import torch
import logging

# Set up logging
logger = logging.getLogger(__name__)

def load_model(model, path: str):
    """
    Load a model's state_dict from a file.

    Args:
        model (torch.nn.Module): The model to load weights into.
        path (str): Path to the saved model weights.

    Returns:
        torch.nn.Module: The model with loaded weights.
    """
    try:
        # Load only model weights for improved security
        model.load_state_dict(torch.load(path, map_location=torch.device('cpu'), weights_only=True))
        model.eval()
    except Exception as e:
        # Use logging instead of print to capture the message in tests
        logger.error(f"Error loading model from {path}: {e}")
    return model
