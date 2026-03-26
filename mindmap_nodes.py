class MindMapNoteNode:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "title": ("STRING", {"default": "", "multiline": False}),
                "description": ("STRING", {"default": "", "multiline": True})
            },
            "optional": {
                "info_in": ("INFO_MAP",)
            }
        }

    RETURN_TYPES = ("INFO_MAP",)
    FUNCTION = "build"
    CATEGORY = "MindMap"

    def build(self, title, description, info_in=None):

        data = {
            "title": title,
            "description": description
        }

        return (data,)


class MindMapLinkNode:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "title": ("STRING", {"default": ""}),
                "url": ("STRING", {"default": "https://"})
            },
            "optional": {
                "info_in": ("INFO_MAP",)
            }
        }

    RETURN_TYPES = ("INFO_MAP",)
    FUNCTION = "build"
    CATEGORY = "MindMap"

    def build(self, title, url, info_in=None):

        data = {
            "title": title,
            "url": url
        }

        return (data,)


class MindMapLinkNodeAdvanced:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "title": ("STRING", {"default": ""}),
                "url": ("STRING", {"default": "https://"}),
                "description": ("STRING", {"default": "", "multiline": True})
            },
            "optional": {
                "info_in": ("INFO_MAP",)
            }
        }

    RETURN_TYPES = ("INFO_MAP",)
    FUNCTION = "build"
    CATEGORY = "MindMap"

    def build(self, title, url, description, info_in=None):

        data = {
            "title": title,
            "url": url,
            "description": description
        }

        return (data,)


class MindMapLinkNodeLite:

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "title": ("STRING", {"default": ""}),
                "url": ("STRING", {"default": "https://"})
            },
            "optional": {
                "info_in": ("INFO_MAP",)
            }
        }

    RETURN_TYPES = ("INFO_MAP",)
    FUNCTION = "build"
    CATEGORY = "MindMap"

    def build(self, title, url, info_in=None):

        data = {
            "title": title,
            "url": url
        }

        return (data,)


NODE_CLASS_MAPPINGS = {
    "MindMapNoteNode": MindMapNoteNode,
    "MindMapLinkNode": MindMapLinkNode,
    "MindMapLinkNodeAdvanced": MindMapLinkNodeAdvanced,
    "MindMapLinkNodeLite": MindMapLinkNodeLite
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MindMapNoteNode": "MindMap Note Node",
    "MindMapLinkNode": "MindMap Link Node",
    "MindMapLinkNodeAdvanced": "MindMap Link Node Advanced",
    "MindMapLinkNodeLite": "MindMap Link Node Lite"
}