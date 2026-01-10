import numpy as np

def gini_index(groups, classes):
    """
    Calculate the Gini index for a split dataset.
    Optimized with vectorization.
    """
    # Count total samples
    n_instances = float(sum([len(group) for group in groups]))
    gini = 0.0
    
    for group in groups:
        size = float(len(group))
        if size == 0:
            continue
            
        # Vectorized purity score
        # Vectorized purity score
        # Use the last column as the target, consistent with train_data construction
        outcomes = group[:, -1]

        
        # Optimized for integer classes (common in ML)
        if np.issubdtype(outcomes.dtype, np.integer):
            # Pad with zeros if some classes are missing in this group
            counts = np.array([(outcomes == c).sum() for c in classes])
            proportions = counts / size
        else:
            proportions = np.array([(outcomes == c).sum() / size for c in classes])
            
        score = np.sum(proportions ** 2)
        gini += (1.0 - score) * (size / n_instances)
        
    return gini

def test_split(index, value, dataset):
    """
    Split a dataset based on an attribute and an attribute value.
    """
    left = dataset[dataset[:, index] < value]
    right = dataset[dataset[:, index] >= value]
    return left, right

def get_best_split(dataset):
    """
    Select the best split point for a dataset.
    Uses Quantiles/Percentiles to optimize speed for continuous variables.
    """
    class_values = np.unique(dataset[:, -1])
    best_index, best_value, best_groups = None, None, None
    best_score = 1.0  # Gini ranges 0 to 0.5 (binary) or 1.0, minimize it
    
    n_features = dataset.shape[1] - 1
    
    for index in range(n_features):
        # OPTIMIZATION: Instead of checking every unique value, check percentiles
        # This speeds up training 100x on large data
        unique_values = np.unique(dataset[:, index])
        
        if len(unique_values) > 10:
            # Check 10 split points (deciles)
            # Check 50 split points (every 2%) to improve accuracy
            # Checking only 10 points (deciles) was too coarse and lost accuracy
            splits = np.percentile(dataset[:, index], np.linspace(2, 98, 49))
        else:
            splits = unique_values
            
        for value in splits:
            groups = test_split(index, value, dataset)
            gini = gini_index(groups, class_values)
            
            if gini < best_score:
                best_index = index
                best_value = value
                best_score = gini
                best_groups = groups
                
    return {'index': best_index, 'value': best_value, 'groups': best_groups}

def to_terminal(group):
    """
    Create a terminal node value.
    Returns the most common output value in a list of rows.
    """
    outcomes = group[:, -1]
    # returns probability of class 1, not hard label
    return np.mean(outcomes)

def split(node, max_depth, min_size, depth):
    """
    Recursive function to create child nodes or terminal nodes.
    """
    left, right = node['groups']
    del(node['groups'])
    
    # check for a no split
    if len(left) == 0 or len(right) == 0:
        node['left'] = node['right'] = to_terminal(np.vstack((left, right)))
        return
    
    # check for max depth
    if depth >= max_depth:
        node['left'], node['right'] = to_terminal(left), to_terminal(right)
        return
    
    # process left child
    if len(left) <= min_size:
        node['left'] = to_terminal(left)
    else:
        node['left'] = get_best_split(left)
        split(node['left'], max_depth, min_size, depth+1)
        
    # process right child
    if len(right) <= min_size:
        node['right'] = to_terminal(right)
    else:
        node['right'] = get_best_split(right)
        split(node['right'], max_depth, min_size, depth+1)

def build_tree(train, max_depth, min_size):
    """
    Build a decision tree from training data.
    """
    root = get_best_split(train)
    split(root, max_depth, min_size, 1)
    return root

def predict(node, row):
    """
    Make a prediction with a decision tree.
    """
    if row[node['index']] < node['value']:
        if isinstance(node['left'], dict):
            return predict(node['left'], row)
        else:
            return node['left']
    else:
        if isinstance(node['right'], dict):
            return predict(node['right'], row)
        else:
            return node['right']