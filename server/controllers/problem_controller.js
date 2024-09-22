import Problems from "../models/ProblemModel.js";
const addProblem = async (req, res) => {
  try {
    const { id, title, difficulty, description, examples, constraints, functionName, starterCode, testCases } = req.body;

    if (!id || !title || !difficulty || !description || !functionName) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const newProblem = new Problems({
      id,
      title,
      difficulty,
      description,
      examples,
      constraints,
      functionName,
      starterCode,
      testCases,
    });

    const savedProblem = await newProblem.save();

    return res.status(201).json({
      message: 'Problem added successfully!',
      problem: savedProblem,
    });
  } catch (error) {
    console.error('Error adding problem:', error);
    return res.status(500).json({ error: 'Server error while adding problem' });
  }
};

const getProblem = async (req, res) => {
    try{
        const problem = await Problems.find()
        return res.json(problem)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProblemById = async (req, res) => {
  try{
    const {id} = req.params
    const problem = await Problems.findOne({id: id})

    return res.json(problem)
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

export {addProblem, getProblem, getProblemById}
